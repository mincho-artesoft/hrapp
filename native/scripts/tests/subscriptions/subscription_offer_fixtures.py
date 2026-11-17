"""Local StoreKit fixtures. Never included in the shipping app or uploaded to Apple."""
import copy
import json
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SCENARIOS = ['Baseline', 'FreeTrial', 'IntroDiscount', 'PayAsYouGo', 'WinBack', 'WinBackIneligible', 'OfferCode', 'PendingApproval']



def write_fixtures(directory):
    base = json.loads((ROOT / 'Calendar/Subscriptions.storekit').read_text())
    for key in ['_applicationInternalID', '_developerTeamID', '_lastSynchronizedDate']:
        base['settings'].pop(key, None)
    for p in base['products'] + base['subscriptionGroups'][0]['subscriptions']:
        p['localizations'] = [next(x for x in p['localizations'] if x['locale'] == 'en_US')]
    for scenario in SCENARIOS:
        data = copy.deepcopy(base)
        data['version'] = {'major': 6, 'minor': 3}
        # Eligibility is cached by subscription group even after clearTransactions().
        # Keep production product IDs, but isolate each generated test group's history.
        group_id = str(uuid.uuid4().int % 10**15)
        data['subscriptionGroups'][0]['id'] = group_id
        for index, p in enumerate(data['subscriptionGroups'][0]['subscriptions']):
            p['subscriptionGroupID'] = group_id
            yearly = 'Yearly' in p['productID']
            if scenario in ['FreeTrial', 'IntroDiscount', 'PayAsYouGo']:
                p['introductoryOffer'] = {
                    'internalID': f'DEMO{index:04}', 'numberOfPeriods': 1,
                    'paymentMode': 'free' if scenario == 'FreeTrial' else 'payUpFront',
                    'subscriptionPeriod': ('P1M' if yearly else 'P1W') if scenario == 'FreeTrial' else ('P1Y' if yearly else 'P1M'),
                }
                if scenario != 'FreeTrial':
                    p['introductoryOffer']['displayPrice'] = '4.99' if yearly else '0.49'
                if scenario == 'PayAsYouGo':
                    p['introductoryOffer'].update(paymentMode='payAsYouGo', numberOfPeriods=3)
            if p['productID'] == 'Cloud.Calendars.Premium.Yearly' and scenario in ['WinBack', 'WinBackIneligible']:
                p['winbackOffers'] = [{
                    'billingPlanType': 'BILLED_UPFRONT', 'displayPrice': '4.99',
                    'internalID': 'DEMO0003', 'isEligible': scenario == 'WinBack',
                    'numberOfPeriods': 1, 'offerID': 'welcome-back-yearly',
                    'paymentMode': 'payUpFront', 'referenceName': 'Welcome Back', 'subscriptionPeriod': 'P1Y'
                }]
            if p['productID'] == 'Cloud.Calendars.Premium.Yearly' and scenario == 'OfferCode':
                p['codeOffers'] = [{
                    'billingPlanType': 'BILLED_UPFRONT', 'eligibility': ['expired', 'existing', 'new'],
                    'internalID': 'DEMO0004', 'isStackable': True, 'numberOfPeriods': 1,
                    'paymentMode': 'free', 'referenceName': 'HRAPPTEST', 'subscriptionPeriod': 'P1M'
                }]
        (directory / f'{scenario}.storekit').write_text(json.dumps(data, indent=2) + '\n')


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    write_fixtures(args.output)
