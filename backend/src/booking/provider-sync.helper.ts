/**
 * Bi-Directional (2-Way) Google Calendar v3 & Microsoft Graph Calendar Sync Engine
 *
 * Reuses the CloudCalendars OAuth applications:
 *  - Google Cloud Project `540859420644` (calendar connections use `https://www.googleapis.com/auth/calendar`)
 *  - Microsoft Entra App `5b1a5159-948f-4b5b-ac6a-009df927c665` (`Calendars.ReadWrite offline_access User.Read`)
 *
 * Capabilities:
 *  1. Authorization Code exchange (`initCodeClient` -> `access_token` + `refresh_token`) for Google,
 *     and PKCE SPA `refresh_token` refresh (with `Origin` header) for Microsoft.
 *  2. Automatic token refresh before background reads or writes (works 24/7 even when the host's browser is closed!).
 *  3. Live busy-event pull from Google & Microsoft (skipping events mirrored FROM CloudCalendars so there is zero self-duplication).
 *  4. Real-time push (Create / Drag-Drop Move / Reschedule / Cancel) to Google Calendar (with optional native Google Meet link generation)
 *     and Microsoft Outlook Calendar (with optional native Microsoft Teams online meeting link generation).
 */

export interface StoredProviderConnection {
  provider: 'google' | 'microsoft';
  connected: boolean;
  accountEmail?: string | null;
  accountName?: string | null;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt: number; // epoch ms
  clientId?: string | null;
  tenant?: string | null;
  autoPushEvents: boolean;
  connectedAt: string;
  updatedAt: string;
  lastSyncedAt?: string | null;
  lastSyncError?: string | null;
}

export interface OAuthConnectionsDoc {
  google?: StoredProviderConnection;
  microsoft?: StoredProviderConnection;
  updatedAt?: string;
}

export interface PublicProviderConnectionStatus {
  connected: boolean;
  accountEmail: string | null;
  accountName: string | null;
  hasOfflineRefresh: boolean;
  autoPushEvents: boolean;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
}

export function sanitizeConnectionsDoc(doc: OAuthConnectionsDoc | null | undefined): {
  google: PublicProviderConnectionStatus;
  microsoft: PublicProviderConnectionStatus;
} {
  const mapOne = (c?: StoredProviderConnection): PublicProviderConnectionStatus => {
    if (!c?.connected || (!c.accessToken && !c.refreshToken)) {
      return {
        connected: false,
        accountEmail: null,
        accountName: null,
        hasOfflineRefresh: false,
        autoPushEvents: false,
        lastSyncedAt: null,
        lastSyncError: null,
      };
    }
    return {
      connected: true,
      accountEmail: c.accountEmail ?? null,
      accountName: c.accountName ?? null,
      hasOfflineRefresh: Boolean(c.refreshToken),
      autoPushEvents: c.autoPushEvents !== false,
      lastSyncedAt: c.lastSyncedAt ?? null,
      lastSyncError: c.lastSyncError ?? null,
    };
  };

  return {
    google: mapOne(doc?.google),
    microsoft: mapOne(doc?.microsoft),
  };
}

export async function exchangeGoogleAuthCode(opts: {
  code: string;
  clientId: string;
  clientSecret?: string | null;
  redirectUri?: string;
}): Promise<{
  accessToken: string;
  refreshToken: string | null;
  idToken: string | null;
  expiresIn: number;
}> {
  const params = new URLSearchParams({
    code: opts.code,
    client_id: opts.clientId,
    grant_type: 'authorization_code',
    redirect_uri: opts.redirectUri || 'postmessage',
  });
  if (opts.clientSecret) {
    params.set('client_secret', opts.clientSecret);
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
    signal: AbortSignal.timeout(12_000),
  });
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok || !json?.access_token) {
    throw new Error(json?.error_description || json?.error || `Google code exchange failed (${res.status})`);
  }

  return {
    accessToken: String(json.access_token),
    refreshToken: json.refresh_token ? String(json.refresh_token) : null,
    idToken: json.id_token ? String(json.id_token) : null,
    expiresIn: Number(json.expires_in) > 0 ? Number(json.expires_in) : 3500,
  };
}

export async function refreshGoogleAccessToken(opts: {
  refreshToken: string;
  clientId: string;
  clientSecret?: string | null;
}): Promise<{ accessToken: string; expiresIn: number }> {
  const params = new URLSearchParams({
    client_id: opts.clientId,
    refresh_token: opts.refreshToken,
    grant_type: 'refresh_token',
  });
  // Native iOS client IDs refresh without client_secret; Web client IDs include client_secret
  if (opts.clientSecret) {
    params.set('client_secret', opts.clientSecret);
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
    signal: AbortSignal.timeout(12_000),
  });
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok || !json?.access_token) {
    throw new Error(json?.error_description || json?.error || `Google token refresh failed (${res.status})`);
  }
  return {
    accessToken: String(json.access_token),
    expiresIn: Number(json.expires_in) > 0 ? Number(json.expires_in) : 3500,
  };
}

export async function refreshMicrosoftAccessToken(opts: {
  refreshToken: string;
  clientId: string;
  tenant?: string | null;
  siteOrigin: string;
}): Promise<{ accessToken: string; refreshToken: string | null; expiresIn: number }> {
  const tenant = (opts.tenant || 'common').trim() || 'common';
  const params = new URLSearchParams({
    client_id: opts.clientId,
    grant_type: 'refresh_token',
    refresh_token: opts.refreshToken,
    scope: 'openid profile email User.Read Calendars.ReadWrite offline_access',
  });

  // Note: SPA PKCE refresh tokens in Entra ID validate the `Origin` header; native public client tokens work without secret too.
  let res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: opts.siteOrigin,
    },
    body: params,
    signal: AbortSignal.timeout(12_000),
  });

  // Fallback without Origin header in case the refresh token was minted by the native iOS Public Client flow
  if (!res.ok) {
    res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
      signal: AbortSignal.timeout(12_000),
    });
  }

  const json: any = await res.json().catch(() => ({}));
  if (!res.ok || !json?.access_token) {
    throw new Error(json?.error_description || json?.error || `Microsoft token refresh failed (${res.status})`);
  }

  return {
    accessToken: String(json.access_token),
    refreshToken: json.refresh_token ? String(json.refresh_token) : null,
    expiresIn: Number(json.expires_in) > 0 ? Number(json.expires_in) : 3500,
  };
}

export interface ImportedBusyEvent {
  id: string;
  externalEventId: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  source: 'google' | 'microsoft';
  color: string;
}

/**
 * Fetches busy events from Google Calendar (`primary`), automatically skipping events
 * that originated from CloudCalendars (`extendedProperties.private.cloudCalendarsEventId` or `mirroredIds`).
 */
export async function pullGoogleCalendarBusyEvents(opts: {
  accessToken: string;
  rangeStartMs: number;
  rangeEndMs: number;
  mirroredGoogleIds?: Set<string>;
}): Promise<ImportedBusyEvent[]> {
  const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
  url.searchParams.set('timeMin', new Date(opts.rangeStartMs).toISOString());
  url.searchParams.set('timeMax', new Date(opts.rangeEndMs).toISOString());
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('maxResults', '250');

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${opts.accessToken}` },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) {
    throw new Error(`Google Calendar sync failed (${res.status}).`);
  }
  const data: any = await res.json();
  const out: ImportedBusyEvent[] = [];

  for (const item of data.items ?? []) {
    if (item.status === 'cancelled' || item.transparency === 'transparent') continue;
    const rawId = String(item.id ?? '');
    if (opts.mirroredGoogleIds?.has(rawId)) continue;
    if (item.extendedProperties?.private?.cloudCalendarsEventId) continue;

    const allDay = Boolean(item.start?.date && !item.start?.dateTime);
    const startIso = item.start?.dateTime ?? (item.start?.date ? `${item.start.date}T00:00:00Z` : null);
    const endIso = item.end?.dateTime ?? (item.end?.date ? `${item.end.date}T00:00:00Z` : null);
    if (!startIso || !endIso) continue;

    out.push({
      id: `gcal_${rawId.slice(0, 96)}`,
      externalEventId: rawId,
      title: String(item.summary || 'Google Calendar').slice(0, 200),
      start: new Date(startIso).toISOString(),
      end: new Date(endIso).toISOString(),
      allDay,
      source: 'google',
      color: '#34A853',
    });
  }
  return out;
}

/**
 * Fetches busy events from Microsoft Graph (`me/calendarView`), automatically skipping events
 * mirrored from CloudCalendars (`categories` includes `CloudCalendars` or `mirroredMsIds`).
 */
export async function pullMicrosoftCalendarBusyEvents(opts: {
  accessToken: string;
  rangeStartMs: number;
  rangeEndMs: number;
  mirroredMicrosoftIds?: Set<string>;
}): Promise<ImportedBusyEvent[]> {
  const url = new URL('https://graph.microsoft.com/v1.0/me/calendarView');
  url.searchParams.set('startDateTime', new Date(opts.rangeStartMs).toISOString());
  url.searchParams.set('endDateTime', new Date(opts.rangeEndMs).toISOString());
  url.searchParams.set('$top', '250');
  url.searchParams.set('$select', 'id,subject,start,end,isAllDay,isCancelled,showAs,categories,transactionId');

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
      Prefer: 'outlook.timezone="UTC"',
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) {
    throw new Error(`Microsoft Calendar sync failed (${res.status}).`);
  }
  const data: any = await res.json();
  const out: ImportedBusyEvent[] = [];

  for (const item of data.value ?? []) {
    if (item.isCancelled || item.showAs === 'free') continue;
    const rawId = String(item.id ?? '');
    if (opts.mirroredMicrosoftIds?.has(rawId)) continue;
    if (Array.isArray(item.categories) && item.categories.includes('CloudCalendarsSynced')) continue;
    if (typeof item.transactionId === 'string' && item.transactionId.startsWith('cc:')) continue;

    const startRaw = item.start?.dateTime
      ? (item.start.dateTime.endsWith('Z') ? item.start.dateTime : `${item.start.dateTime}Z`)
      : null;
    const endRaw = item.end?.dateTime
      ? (item.end.dateTime.endsWith('Z') ? item.end.dateTime : `${item.end.dateTime}Z`)
      : null;
    if (!startRaw || !endRaw) continue;

    out.push({
      id: `mscal_${rawId.slice(0, 96)}`,
      externalEventId: rawId,
      title: String(item.subject || 'Outlook Calendar').slice(0, 200),
      start: new Date(startRaw).toISOString(),
      end: new Date(endRaw).toISOString(),
      allDay: Boolean(item.isAllDay),
      source: 'microsoft',
      color: '#0078D4',
    });
  }
  return out;
}

/**
 * Creates or updates a CloudCalendars event directly in the user's primary Google Calendar!
 * If `generateGoogleMeet` is true and no existing Google Meet link is present, requests native Hangouts/Google Meet creation!
 */
export async function pushUpsertGoogleCalendarEvent(opts: {
  accessToken: string;
  eventDoc: any;
  existingGoogleEventId?: string | null;
  generateGoogleMeet?: boolean;
  sendUpdates?: 'all' | 'none';
}): Promise<{
  googleEventId: string;
  htmlLink: string | null;
  meetUrl: string | null;
}> {
  const ev = opts.eventDoc;
  const tz = ev.details?.timeZone || 'UTC';
  const attendees = Array.isArray(ev.details?.attendees)
    ? ev.details.attendees
        .filter((a: any) => a?.email)
        .map((a: any) => ({
          email: a.email,
          ...(a.name ? { displayName: a.name } : {}),
        }))
    : [];

  const allDay = Boolean(ev.allDay);
  const startPayload = allDay
    ? { date: String(ev.start).slice(0, 10) }
    : { dateTime: new Date(ev.start).toISOString(), timeZone: tz };
  const endPayload = allDay
    ? { date: String(ev.end).slice(0, 10) }
    : { dateTime: new Date(ev.end).toISOString(), timeZone: tz };

  const descriptionParts = [
    ev.details?.notes || ev.description || '',
    ev.details?.videoCallURL ? `Video Call: ${ev.details.videoCallURL}` : '',
  ].filter(Boolean);

  const payload: any = {
    summary: ev.title || 'Cloud Calendars Event',
    description: descriptionParts.join('\n\n') || undefined,
    location: ev.location || undefined,
    start: startPayload,
    end: endPayload,
    ...(attendees.length ? { attendees } : {}),
    extendedProperties: {
      private: {
        cloudCalendarsEventId: String(ev.id),
      },
    },
  };

  const wantMeet = Boolean(opts.generateGoogleMeet && !opts.existingGoogleEventId && !ev.details?.videoCallURL);
  if (wantMeet) {
    payload.conferenceData = {
      createRequest: {
        requestId: `cc_${ev.id}_${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }

  const sendUpdates = opts.sendUpdates ?? (attendees.length ? 'all' : 'none');

  const doRequest = async (existingId: string | null) => {
    const base = existingId
      ? `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(existingId)}`
      : 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    const url = new URL(base);
    url.searchParams.set('sendUpdates', sendUpdates);
    if (wantMeet && !existingId) {
      url.searchParams.set('conferenceDataVersion', '1');
    }
    return fetch(url, {
      method: existingId ? 'PATCH' : 'POST',
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000),
    });
  };

  let res = await doRequest(opts.existingGoogleEventId ?? null);
  // If user manually deleted the mirrored event in Google Calendar, recreate cleanly
  if (res.status === 404 && opts.existingGoogleEventId) {
    res = await doRequest(null);
  }

  const data: any = await res.json().catch(() => ({}));
  if (!res.ok || !data?.id) {
    throw new Error(data?.error?.message || `Google Calendar write failed (${res.status})`);
  }

  const meetUrl =
    data.hangoutLink ||
    data.conferenceData?.entryPoints?.find((ep: any) => ep?.entryPointType === 'video')?.uri ||
    null;

  return {
    googleEventId: String(data.id),
    htmlLink: data.htmlLink ? String(data.htmlLink) : null,
    meetUrl: meetUrl ? String(meetUrl) : null,
  };
}

export async function pushDeleteGoogleCalendarEvent(opts: {
  accessToken: string;
  googleEventId: string;
  sendUpdates?: 'all' | 'none';
}): Promise<void> {
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(opts.googleEventId)}`,
  );
  url.searchParams.set('sendUpdates', opts.sendUpdates ?? 'all');
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${opts.accessToken}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Google Calendar delete failed (${res.status})`);
  }
}

/**
 * Creates or updates a CloudCalendars event directly in the user's primary Microsoft Outlook Calendar!
 * If `generateTeamsMeeting` is true, sets `isOnlineMeeting: true` so Graph mints a Teams meeting URL!
 */
export async function pushUpsertMicrosoftCalendarEvent(opts: {
  accessToken: string;
  eventDoc: any;
  existingMicrosoftEventId?: string | null;
  generateTeamsMeeting?: boolean;
  includeAttendees?: boolean;
}): Promise<{
  microsoftEventId: string;
  webLink: string | null;
  teamsUrl: string | null;
}> {
  const ev = opts.eventDoc;
  const attendees =
    opts.includeAttendees !== false && Array.isArray(ev.details?.attendees)
      ? ev.details.attendees
          .filter((a: any) => a?.email)
          .map((a: any) => ({
            emailAddress: {
              address: a.email,
              ...(a.name ? { name: a.name } : {}),
            },
            type: 'required',
          }))
      : [];

  const bodyText = [
    ev.details?.notes || ev.description || '',
    ev.details?.videoCallURL ? `Video Call: ${ev.details.videoCallURL}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const payload: any = {
    subject: ev.title || 'Cloud Calendars Event',
    body: {
      contentType: 'text',
      content: bodyText,
    },
    start: {
      dateTime: new Date(ev.start).toISOString().replace(/Z$/, ''),
      timeZone: 'UTC',
    },
    end: {
      dateTime: new Date(ev.end).toISOString().replace(/Z$/, ''),
      timeZone: 'UTC',
    },
    isAllDay: Boolean(ev.allDay),
    ...(ev.location ? { location: { displayName: String(ev.location) } } : {}),
    ...(attendees.length ? { attendees } : {}),
    categories: ['CloudCalendarsSynced'],
  };

  if (!opts.existingMicrosoftEventId) {
    payload.transactionId = `cc:${ev.id}`;
    if (opts.generateTeamsMeeting && !ev.details?.videoCallURL) {
      payload.isOnlineMeeting = true;
    }
  }

  const doRequest = async (existingId: string | null) => {
    const endpoint = existingId
      ? `https://graph.microsoft.com/v1.0/me/events/${encodeURIComponent(existingId)}`
      : 'https://graph.microsoft.com/v1.0/me/events';
    const bodyObj = existingId
      ? (() => {
          const clone = { ...payload };
          delete clone.transactionId;
          return clone;
        })()
      : payload;
    return fetch(endpoint, {
      method: existingId ? 'PATCH' : 'POST',
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObj),
      signal: AbortSignal.timeout(12_000),
    });
  };

  let res = await doRequest(opts.existingMicrosoftEventId ?? null);
  if (res.status === 404 && opts.existingMicrosoftEventId) {
    res = await doRequest(null);
  }

  const data: any = await res.json().catch(() => ({}));
  if (!res.ok || !data?.id) {
    throw new Error(data?.error?.message || `Microsoft Calendar write failed (${res.status})`);
  }

  return {
    microsoftEventId: String(data.id),
    webLink: data.webLink ? String(data.webLink) : null,
    teamsUrl: data.onlineMeeting?.joinUrl ? String(data.onlineMeeting.joinUrl) : null,
  };
}

export async function pushDeleteMicrosoftCalendarEvent(opts: {
  accessToken: string;
  microsoftEventId: string;
}): Promise<void> {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/events/${encodeURIComponent(opts.microsoftEventId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${opts.accessToken}` },
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Microsoft Calendar delete failed (${res.status})`);
  }
}
