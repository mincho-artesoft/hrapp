// CloudFront viewer-request function: apex-to-www-cloud-calendars.
// Apple must fetch AASA over HTTPS without following any redirects.
// Normal website pages keep their canonical www host and trailing slash.
function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  var uri = request.uri;
  if (uri === '/.well-known/apple-app-site-association' ||
      uri === '/.well-known/apple-app-site-association/' ||
      uri === '/apple-app-site-association' ||
      uri === '/apple-app-site-association/') {
    // An internal rewrite also supports the root alias and previously cached
    // slash URL. All variants use the existing JSON object, not an S3 folder.
    request.uri = '/.well-known/apple-app-site-association';
    return request;
  }
  var apex = host.indexOf('www.') !== 0;
  var bare = uri !== '/' && !uri.endsWith('/') && uri.lastIndexOf('.') <= uri.lastIndexOf('/');
  if (!apex && !bare) return request;
  var qs = '';
  var keys = Object.keys(request.querystring);
  if (keys.length) {
    qs = '?' + keys.map(function (k) { return k + '=' + request.querystring[k].value; }).join('&');
  }
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: 'https://' + (apex ? 'www.' + host : host) + (bare ? uri + '/' : uri) + qs },
      'cache-control': { value: 'public,max-age=31536000' },
    },
  };
}
