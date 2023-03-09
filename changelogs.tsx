interface IChangelogText {
  type: 'text';
  content: string;
}

interface IChangelogImage {
  type: 'image';
  content: {
    pc: string;
    mobile?: string;
    key: string;
  };
}

export type ChangelogType = {
  [key: string]: (IChangelogText | IChangelogImage)[];
};

// const preReleaseChangelogs: { [version: string]: ChangelogType } = {
//   '2.0.2': {
//     Leaderboards: [
//       {
//         type: 'text',
//         content: 'Panels now have a blurry background when in dark theme.',
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'https://cdn.namespace.media/s/YobpHtoDxTs2xy4/download/msedge_SyIjOYJM6O.png',
//           mobile:
//             'https://cdn.namespace.media/s/CciydiNHS78T73g/download/msedge_NuhJRDFfOo.png',
//           key: '',
//         },
//       },
//       {
//         type: 'text',
//         content: 'Mobile podium panels are now equally sized.',
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'https://cdn.namespace.media/s/T7GyFGrps8e8D66/download/msedge_n851ZhgOdT.png',
//           key: '',
//         },
//       },
//     ],
//   },

//   '2.0.3': {
//     'Status Page': [
//       {
//         type: 'text',
//         content: 'Status Page has been added.',
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'https://cdn.namespace.media/s/GxZLijTBD6BxSES/download/OmjcRa4cPE.png',
//           key: '',
//         },
//       },
//       {
//         type: 'text',
//         content: 'Charts now only display for MD viewports and bigger.',
//       },
//       {
//         type: 'text',
//         content:
//           'Incidedents are now collapsabe and optimized for mobile usage.',
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'https://cdn.namespace.media/s/eg68a53AB7XT22r/download/msedge_JZwa3b1FZl.gif',
//           mobile:
//             'https://cdn.namespace.media/s/TtkSaoY3xcMEHzg/download/msedge_Po4DU0Dzoq.gif',
//           key: '',
//         },
//       },
//     ],
//     'Page Detail Titles': [
//       {
//         type: 'text',
//         content:
//           'Page detail titles without an arrow now no longer act like a link.',
//       },
//     ],
//   },

//   '2.0.4': {
//     'Status Page': [
//       {
//         type: 'text',
//         content: 'Improved header appearance.',
//       },
//     ],
//   },

//   '2.0.5': {
//     'Header Behavior': [
//       {
//         type: 'text',
//         content: 'Some header gradients now adapt to the displayed image.',
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'https://cdn.namespace.media/s/2aPAzFy2BQaH68y/download/msedge_a5llRKBIqi.png',
//           mobile:
//             'https://cdn.namespace.media/s/L4YKRrHe5W3xp2X/download/msedge_fsxxRhP3Hb.png',
//           key: '',
//         },
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'https://cdn.namespace.media/s/FQr4z2Dq7aWJYfL/download/msedge_BHGTnKaC1T.png',
//           mobile:
//             'https://cdn.namespace.media/s/JFqXKcREADSXeRx/download/msedge_NHIlfAFCS4.png',
//           key: '',
//         },
//       },
//       {
//         type: 'text',
//         content:
//           'A debug window in the top left corner has been added to monitor this behaviour over the next couple of days. ( Only on LG and larger )',
//       },
//     ],
//   },

//   '2.0.6': {
//     'Incident Editor': [
//       {
//         type: 'text',
//         content: 'Added the incident creator and editor.',
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'https://cdn.namespace.media/s/5E4Ajg5iL73bC8x/download/msedge_KlZh9Itvdg.png',
//           mobile:
//             'https://cdn.namespace.media/s/p64ZjqjaFQ8WGmM/download/msedge_Bfnx6UYNgS.png',
//           key: '',
//         },
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'https://cdn.namespace.media/s/rKYRPd68LHWjkSZ/download/msedge_UbJpcCqUMG.png',
//           mobile:
//             'https://cdn.namespace.media/s/fxtCKYFATCcc3an/download/msedge_ht3L2DEVTV.png',
//           key: '',
//         },
//       },
//     ],
//     'Page Loading': [
//       {
//         type: 'text',
//         content: 'Added loading animation for initial page load.',
//       },
//       {
//         type: 'text',
//         content:
//           'Changed "We\'re loading ur ass..." to "We are getting ready...".',
//       },
//       {
//         type: 'text',
//         content: 'Added loading animation to guild dashboard.',
//       },
//     ],
//     'Server List': [
//       {
//         type: 'text',
//         content:
//           'Fixed sizing bug where some guild icons would randomly be huge.',
//       },
//     ],
//   },

//   '2.0.7': {
//     'Server Dashboard': [
//       {
//         type: 'text',
//         content:
//           'Icons have been corrected and clusters are now in correct groups.',
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'https://cdn.namespace.media/s/oqkA6FajA5MYDzM/download/msedge_zrVDYI64fw.png',
//           mobile:
//             'https://cdn.namespace.media/s/bdpkprBg57gbPdB/download/msedge_U5HKP6q1di.png',
//           key: '',
//         },
//       },
//       {
//         type: 'text',
//         content: 'Removed incorrect "back"-arrow from settings page.',
//       },
//       {
//         type: 'text',
//         content:
//           'Modules where server premium is required, are now disabled correctly.',
//       },
//       {
//         type: 'text',
//         content:
//           'Every News and Text channel is now available to be set as the channel for the Dynamic Leaderboard.',
//       },
//     ],
//     'User Dashboard': [
//       {
//         type: 'text',
//         content:
//           'Icons have been corrected and clusters are now in correct groups.',
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'https://cdn.namespace.media/s/CRneznMDoBeJTMK/download/msedge_yWK07Lkm26.png',
//           mobile:
//             'https://cdn.namespace.media/s/4sYkrpX9iWjcoYY/download/msedge_gaOxgpCsiu.png',
//           key: '',
//         },
//       },
//     ],
//     'PWA Appearance': [
//       {
//         type: 'text',
//         content: 'PWA orientation is now locked to portrait.',
//       },
//     ],
//   },
//   '2.0.8': {
//     Legal: [
//       {
//         type: 'text',
//         content: 'Added Privacy Policy.',
//       },
//       {
//         type: 'text',
//         content: 'Added Safety Guidelines.',
//       },
//     ],
//     'User Dashboard': [
//       {
//         type: 'text',
//         content: 'Added "Report a Bug" button.',
//       },
//     ],
//   },
//   '2.0.9': {
//     Accessiblity: [
//       {
//         type: 'text',
//         content: 'Added handy information tooltips. (PC only)',
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'http://cdn.namespace.media/s/mELEAAfdeKqm6Ew/download/msedge_X2TBMw7Lco.png',
//           key: '',
//         },
//       },
//     ],
//     'Blog Post Editor': [
//       {
//         type: 'text',
//         content: 'The editor is now usable in split scren. (PC only)',
//       },
//       {
//         type: 'image',
//         content: {
//           pc: 'http://cdn.namespace.media/s/zJ8fgLo3tPtKXRD/download/msedge_6JkecChdAA.png',
//           key: '',
//         },
//       },
//     ],
//   },
// };

const changelogs: { [version: string]: ChangelogType } = {
  '2.0.14': {
    Leaderboards: [
      {
        type: 'text',
        content: 'Up arrows no longer appear white.',
      },
      {
        type: 'text',
        content: 'Normal users can no longer open the "edit" window.',
      },
    ],
    'Home Page': [
      {
        type: 'text',
        content:
          'The "Features"-Arrow is now being displayed in the theme-dependent color.',
      },
      {
        type: 'text',
        content:
          'The Premium subtitle is now being displayed in the theme-dependent color.',
      },
    ],
  },
};

export default changelogs;
