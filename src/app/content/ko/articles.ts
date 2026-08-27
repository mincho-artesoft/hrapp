import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_KO: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
    title: '날씨가 이미 들어 있는 달력',
    short: '달력 안의 날씨',
    description: '하루를 짜기 위해 앱을 두 개 보는 것이 왜 설계 결함인지, 그리고 예보가 옆에 놓이는 대신 화면의 일부인 달력은 어떤 모습인지.',
    lede: '거의 모든 사람이 두 앱 사이에서 하루를 짠다. 달력은 어디에 있어야 하는지 알려주고, 날씨 앱은 도착했을 때 날씨가 어떨지 알려준다. 그 둘을 머릿속에서 겹쳐 두는 일은 아무도 자기가 하고 있다는 걸 알아채지 못하는 부분이다 — 토요일 하루를 통째로 날리기 전까지는.',
    commonBelief: '달력은 약속을 위한 것이고 날씨 앱은 날씨를 위한 것이며, 둘을 따로 두는 게 그저 휴대전화가 원래 그런 거라는 생각.',
    sections: [
      {
        heading: '앱 두 개의 대가는 두 번의 탭이 아니다',
        body: [
          '전환 자체는 아무 비용도 들지 않는다. 비싼 것은 그 둘이 무엇이 중요한지에 대해 결코 합의하지 않는다는 점이다. 달력은 토요일 열한 시부터 두 시간이 차 있다는 걸 안다. 날씨 앱은 열 시부터 한 시까지 비가 온다는 걸 안다. 어느 쪽도 그 두 사실을 합치면 그 블록을 옮겨야 한다는 뜻이 된다는 걸 모른다.',
          '통합 계층은 당신이다. 그건 바쁘지 않을 때까지만 작동한다. 그리고 바쁠 때야말로 계획을 지키는 일의 값어치가 가장 크다.',
        ],
      },
      {
        heading: '예보가 격자 안에 있으면 무엇이 달라지는가',
        body: [
          '예보를 일정 뒤에 두면 충돌은 저절로 풀린다. 눅눅한 오전과 마른 오후가, 지금 넣으려던 회의와 같은 한 번의 눈길 안에 보인다. 판단에 생각을 쓸 일이 없어진다.',
          '이건 옆에 붙인 위젯이 아니다. 주 보기와 월 보기의 하루하루가 저마다의 조건을 지니고, 일정 하나하나가 실제로 차지하는 시간대의 예보를 지닌다 — 정작 필요했던 부분을 평균 내버리는 하루치 요약이 아니라.',
        ],
      },
    ],
    claims: {
      forecastDays: '예보 일수 — 달력 안과 각 일정 옆',
      views: '날씨가 함께 나오는 보기: 일·주·월·년·목록',
      price: '날씨 기능의 값',
    },
    practical: [
      '바깥 일정을 넣기 전에 주 보기에서 날짜 뒤의 띠를 본다.',
      '일정을 탭해 그 날이 아니라 그 시간대의 예보를 본다.',
      '날씨에 좌우되는 일은 먼저 열나흘에 대고 놓은 다음, 이틀 전에 다듬는다.',
      '이레를 넘어가는 것은 모두 계획이 아니라 형태로 다룬다.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
  },

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google, Outlook을 한 화면에',
    short: '세 계정, 한 화면',
    description: '거의 모두의 삶은 개인 Apple 달력과 Google 계정, 회사의 Exchange로 나뉘어 있다. 그것들이 같은 격자에 들어오면 무엇이 달라지는가.',
    lede: '문제는 그 달력들 중 하나가 나쁘다는 게 거의 아니다. 셋인데 주는 하나라는 것이다.',
    commonBelief: '일과 사생활을 다른 앱에 두는 것이 경계이지 결함은 아니라는 생각.',
    sections: [
      {
        heading: '이중 예약은 구조의 문제다',
        body: [
          '약속이 세 곳에 흩어져 있으면 어느 곳도 당신이 비었는지 답할 수 없다. 합치는 단계는 당신이고, 게다가 기억에 의존해 실행된다. 보통은 누군가 답을 기다리는 동안에.',
          '그래서 전형적인 실패는 일정을 잊는 게 아니다. 볼 수 없었던 일정과 부딪치는 무언가를 수락하는 것이다.',
        ],
      },
      {
        heading: '하나의 격자가 주는 것',
        body: [
          '모든 계정이 같은 주에, 출처별로 색이 나뉘어, 그 자리에서 고쳐진다. 어느 앱에 답이 있는지 궁금해할 일이 없어진다. 질문이 복수형이기를 그치기 때문이다.',
          'iCloud와 Google은 무료 단계에서 동기화된다. Microsoft 계정 — Outlook과 Exchange — 은 유료에 속한다. 그 연결에는 다른 것들에 없는 반복 비용이 들기 때문이다.',
        ],
      },
    ],
    claims: {
      accounts: '한 화면에 들어가는 계정 종류의 수',
      premiumMonthly: 'Microsoft를 더하는 월 비용(달러)',
    },
    practical: [
      '개인 계정을 먼저, 충돌을 일으키는 쪽을 나중에 더한다.',
      '범주가 아니라 계정으로 색을 나눈다. 한눈에 필요한 건 출처다.',
      '남들이 이미 읽고 있는 달력에 계속 쓴다.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
    title: '달력이 아니라 일정 하나만 공유하기',
    short: '일정 하나 공유하기',
    description: '일정 하나를 보내는 일이 어떻게 작동하는지, 상대가 실제로 받는 것은 무엇인지, 그리고 왜 상대는 아무것도 설치하지 않고 볼 수 있는지.',
    lede: '달력 공유는 대개 전부 아니면 전무다. 누군가에게 당신 달력의 접근 권한이 있거나 없거나. 저녁 약속 하나를 보내는 데 그 둘 중 어느 것도 필요해서는 안 된다.',
    commonBelief: '일정을 공유한다는 건 누군가에게 남은 한 주로 난 창을 열어주는 일이라는 생각.',
    sections: [
      {
        heading: '실제로 나가는 것',
        body: [
          '일정을 만들면 앱이 공유를 제안한다. 오가는 것은 링크 하나다 — 메일로든, 메시지로든, 상대가 가진 무엇으로든 — 그 링크 뒤에는 그 일정만 담고 다른 것은 아무것도 담지 않은 달력 피드가 있다.',
          '스크린샷도 아니고, 낡아가는 사본도 아니다. 시각이 바뀌면 피드도 함께 바뀌고, 보낸 상대는 당신이 무언가를 다시 보내지 않아도 그 변화를 본다.',
        ],
      },
      {
        heading: '그것이 아닌 것',
        body: [
          '링크는 평범한 달력 구독이다. Apple 캘린더가 읽고, Google 캘린더가 읽고, Outlook이 읽는다. 메시지에는 앱을 원하는 사람을 위한 App Clip도 함께 간다 — 설치 없이 열린다. 그건 문이지 요금소가 아니다.',
          '즉시는 아니다. 피드는 앱들에게 한 시간마다 다시 보라고 요청하는데, 그건 요청이지 규칙이 아니다. 비밀도 아니다. 링크에는 무작위 스물두 글자가 실려 있어 아무도 맞히지 못하지만, 가진 사람은 읽을 수 있다. 그리고 지금은 읽기 전용이다.',
        ],
      },
    ],
    claims: {
      refreshHint: '피드 갱신 요청 사이의 시간(시)',
      linkLength: '링크 속 무작위 글자 수 — 이것이 추측을 불가능하게 한다',
      sharePrice: '공유의 값',
    },
    practical: [
      '만든 직후, 일정 자체에서 공유한다.',
      '그 사람과 이미 쓰고 있는 통로로 링크를 보낸다.',
      '막판에 시각이 바뀌면 일정을 옮기는 것에 더해 한마디 적는다.',
      '일정이 지나면 링크를 회수한다. 문서 공유를 그만두듯이.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
    title: '구독이 실제로 사주는 것',
    short: '구독이 사주는 것',
    description: '유료 두 단계, 무엇이 그 둘을 가르는지, 그리고 어느 쪽이 — 있다면 — 당신 것인지 알아보는 법.',
    lede: '무엇이 가르는지를 아무도 분명히 말하지 않으면 두 단계로도 충분히 헷갈린다. 그 둘을 가르는 것은 Microsoft다.',
    commonBelief: '위 단계는 같은 기능이 그저 더 많은 것이라는 생각.',
    sections: [
      {
        heading: '첫 단계는 광고를 없앤다',
        body: [
          'iCloud와 Google 달력을 가로지르는 일정 관리, Google 공유 권한, 자동 Meet 링크, 더 빠른 날씨 갱신도 더해진다. 하지만 사람들이 사는 이유는 광고다.',
          '이 값이면 한 해에 커피 한 잔 정도이고, 무언가 지불할 뜻이 있는 사람 거의 모두에게 맞는 단계다.',
        ],
      },
      {
        heading: '둘째 단계는 Microsoft를 위한 것이다',
        body: [
          'Outlook과 Exchange 동기화, Teams 링크, 회사를 포함한 계정 간 관리, 참석자 관리. 자릿수가 하나 다른 값이지만, 그건 연결 자체의 값도 그렇기 때문이다.',
          '회사 달력이 Microsoft에 있지 않다면 여기에 당신 몫은 없다. 두 단계 모두 연 단위가 싸다. 절약은 알맞은 수준이지 극적이지 않다. 해지하면 무료 단계로 돌아가고 달력은 그대로 남는다. 일정은 애초에 우리 것이 아니었으니까.',
        ],
      },
    ],
    claims: {
      advancedMonthly: '첫 단계, 월(달러)',
      advancedYearly: '첫 단계, 연(달러)',
      premiumMonthly: '둘째 단계, 월(달러)',
      premiumYearly: '둘째 단계, 연(달러)',
    },
    practical: [
      '첫 단계는 달력을 여는 게 아니라 광고를 없애려고 산다.',
      '둘째 단계는 일이 Microsoft에 살고 있을 때만 산다.',
      '확신이 서면 연 단위로 옮긴다. 절약은 진짜지만 작다.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
