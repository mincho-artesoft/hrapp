#!/usr/bin/env python3
"""Run the real subscription manager against Apple's local StoreKit test service."""
import argparse
import plistlib
import subprocess
import tempfile
from subscription_offer_fixtures import write_fixtures, SCENARIOS
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--only', help='Run one SubscriptionStoreKitTests method')
parser.add_argument('--simulator', help='Booted iOS simulator UDID (otherwise use macOS)')
args = parser.parse_args()
ROOT = Path(__file__).resolve().parents[3]
work = Path(tempfile.mkdtemp(prefix='hrapp-storekit-tests-'))
project = work / 'SubscriptionTests.xcodeproj'
project.mkdir()
objects = {}
write_fixtures(work)

def add(kind, **fields):
    key = f'{len(objects) + 1:024X}'
    objects[key] = {'isa': kind, **fields}
    return key

source_files = [ROOT / 'Calendar/Subscription/SubscriptionManager.swift',
                ROOT / 'Calendar/Subscription/SubscriptionStatus.swift',
                ROOT / 'scripts/tests/subscriptions/SubscriptionStoreKitTests.swift',
                ROOT / 'Calendar/Subscription/SubscriptionOfferPresentation.swift',
                ROOT / 'Calendar/Subscription/SubscriptionOfferCampaign.swift',
                ROOT / 'Calendar/Еxtensions/Product+Extension.swift']
refs = [add('PBXFileReference', lastKnownFileType='sourcecode.swift', path=str(p), sourceTree='<absolute>') for p in source_files]
config_ref = add('PBXFileReference', lastKnownFileType='text', path=str(ROOT / 'Calendar/Subscriptions.storekit'), sourceTree='<absolute>')
offer_refs = [add('PBXFileReference', lastKnownFileType='text', path=str(work / (s + '.storekit')), sourceTree='<absolute>') for s in SCENARIOS]
product = add('PBXFileReference', explicitFileType='wrapper.cfbundle', path='SubscriptionTests.xctest', sourceTree='BUILT_PRODUCTS_DIR')
sources = add('PBXSourcesBuildPhase', buildActionMask=2147483647, files=[add('PBXBuildFile', fileRef=r) for r in refs], runOnlyForDeploymentPostprocessing=0)
resources = add('PBXResourcesBuildPhase', buildActionMask=2147483647, files=[add('PBXBuildFile', fileRef=r) for r in [config_ref] + offer_refs], runOnlyForDeploymentPostprocessing=0)
frameworks = add('PBXFrameworksBuildPhase', buildActionMask=2147483647, files=[], runOnlyForDeploymentPostprocessing=0)
group = add('PBXGroup', children=refs + [config_ref, product] + offer_refs, sourceTree='<group>')
host_source = work / 'Host.swift'
host_source.write_text('import SwiftUI\n@main struct Host: App { var body: some Scene { WindowGroup { Text("StoreKit Tests") } } }\n')
host_ref = add('PBXFileReference', lastKnownFileType='sourcecode.swift', path=str(host_source), sourceTree='<absolute>')
host_product = add('PBXFileReference', explicitFileType='wrapper.application', path='Host.app', sourceTree='BUILT_PRODUCTS_DIR')
host_sources = add('PBXSourcesBuildPhase', buildActionMask=2147483647, files=[add('PBXBuildFile', fileRef=host_ref)], runOnlyForDeploymentPostprocessing=0)
host_resources = add('PBXResourcesBuildPhase', buildActionMask=2147483647, files=[add('PBXBuildFile', fileRef=r) for r in [config_ref] + offer_refs], runOnlyForDeploymentPostprocessing=0)
host_config = add('XCBuildConfiguration', name='Debug', buildSettings={'SDKROOT':'macosx','MACOSX_DEPLOYMENT_TARGET':'15.0','SWIFT_VERSION':'6.0','GENERATE_INFOPLIST_FILE':'YES','PRODUCT_BUNDLE_IDENTIFIER':'Deksan.CalendarASD.StoreKitTestHost.' + work.name.replace('_','-'),'PRODUCT_NAME':'$(TARGET_NAME)','CODE_SIGN_IDENTITY':'-','ALWAYS_SEARCH_USER_PATHS':'NO'})
host_configs = add('XCConfigurationList', buildConfigurations=[host_config], defaultConfigurationIsVisible=0, defaultConfigurationName='Debug')
host_target = add('PBXNativeTarget', name='Host', productName='Host', productType='com.apple.product-type.application', productReference=host_product, buildConfigurationList=host_configs, buildPhases=[host_sources,host_resources], buildRules=[],dependencies=[])
objects[group]['children'] += [host_ref,host_product]
settings = {'TEST_HOST':'$(BUILT_PRODUCTS_DIR)/Host.app/Contents/MacOS/Host','BUNDLE_LOADER':'$(TEST_HOST)', 'ALWAYS_SEARCH_USER_PATHS':'NO','SDKROOT':'macosx', 'MACOSX_DEPLOYMENT_TARGET':'15.0', 'SWIFT_VERSION':'6.0', 'SWIFT_ACTIVE_COMPILATION_CONDITIONS':'DEBUG', 'GENERATE_INFOPLIST_FILE':'YES', 'PRODUCT_BUNDLE_IDENTIFIER':'Deksan.CalendarASD.SubscriptionTests', 'PRODUCT_NAME':'$(TARGET_NAME)', 'CODE_SIGN_IDENTITY':'-', 'CODE_SIGNING_ALLOWED':'YES', 'LD_RUNPATH_SEARCH_PATHS':['$(inherited)', '@loader_path/Frameworks', '@executable_path/Frameworks'], 'ENABLE_TESTING_SEARCH_PATHS':'YES'}
cfg = add('XCBuildConfiguration', name='Debug', buildSettings=settings)
configs = add('XCConfigurationList', buildConfigurations=[cfg], defaultConfigurationIsVisible=0, defaultConfigurationName='Debug')
target = add('PBXNativeTarget', name='SubscriptionTests', productName='SubscriptionTests', productType='com.apple.product-type.bundle.unit-test', productReference=product, buildConfigurationList=configs, buildPhases=[sources, frameworks, resources], buildRules=[], dependencies=[add('PBXTargetDependency',target=host_target)])
if args.simulator:
    for config_id in [host_config, cfg]:
        settings_for_target = objects[config_id]['buildSettings']
        settings_for_target.update(SDKROOT='iphonesimulator', IPHONEOS_DEPLOYMENT_TARGET='26.0', CODE_SIGNING_ALLOWED='NO', TARGETED_DEVICE_FAMILY='1,2', GENERATE_INFOPLIST_FILE='YES', INFOPLIST_KEY_UIApplicationSceneManifest_Generation='YES', INFOPLIST_KEY_UILaunchScreen_Generation='YES')
        settings_for_target.pop('MACOSX_DEPLOYMENT_TARGET', None)
    objects[cfg]['buildSettings']['TEST_HOST'] = '$(BUILT_PRODUCTS_DIR)/Host.app/Host'

projcfg = add('XCBuildConfiguration', name='Debug', buildSettings={})
projconfigs = add('XCConfigurationList', buildConfigurations=[projcfg], defaultConfigurationIsVisible=0, defaultConfigurationName='Debug')
root = add('PBXProject', attributes={'LastUpgradeCheck':'2610','TargetAttributes':{target:{'TestTargetID':host_target}}}, buildConfigurationList=projconfigs, compatibilityVersion='Xcode 14.0', developmentRegion='en', hasScannedForEncodings=0, knownRegions=['en'], mainGroup=group, productRefGroup=group, projectDirPath='', projectRoot='', targets=[host_target,target])
(project / 'project.pbxproj').write_bytes(plistlib.dumps({'archiveVersion':'1', 'classes':{}, 'objectVersion':'56', 'objects':objects, 'rootObject':root}))
schemes = project / 'xcshareddata/xcschemes'
schemes.mkdir(parents=True)
(schemes / 'SubscriptionTests.xcscheme').write_text(f'''<?xml version="1.0" encoding="UTF-8"?>
<Scheme version="1.7"><BuildAction><BuildActionEntries><BuildActionEntry buildForTesting="YES"><BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{target}" BuildableName="SubscriptionTests.xctest" BlueprintName="SubscriptionTests" ReferencedContainer="container:SubscriptionTests.xcodeproj"/></BuildActionEntry></BuildActionEntries></BuildAction><TestAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.DebuggerFoundation.Launcher.LLDB"><Testables><TestableReference skipped="NO"><BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{target}" BuildableName="SubscriptionTests.xctest" BlueprintName="SubscriptionTests" ReferencedContainer="container:SubscriptionTests.xcodeproj"/></TestableReference></Testables><StoreKitConfigurationFileReference identifier="{ROOT / 'Calendar/Subscriptions.storekit'}"/></TestAction></Scheme>''')
print(f'StoreKit verification workspace: {work}', flush=True)
raise SystemExit(subprocess.run(['xcodebuild','test','-project',str(project),'-scheme','SubscriptionTests','-destination',('platform=iOS Simulator,id=' + args.simulator) if args.simulator else 'platform=macOS','-derivedDataPath',str(work/'DerivedData'),'-parallel-testing-enabled','NO','-jobs','2'] + (['-only-testing:SubscriptionTests/SubscriptionStoreKitTests/' + args.only] if args.only else [])).returncode)
