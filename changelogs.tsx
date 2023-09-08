interface IChangelogText {
  type: "text";
  content: string;
}

interface IChangelogImage {
  type: "image";
  content: {
    pc: string;
    mobile?: string;
    key: string;
  };
}

type IChangelogEntity = {
  thread_id?: string;
  submitter_id?: string;
  submit_type?: "bug" | `suggestion`;
} & (IChangelogText | IChangelogImage);

export type ChangelogType = {
  [key: string]: IChangelogEntity[];
};

const changelogs: { [version: string]: ChangelogType } = {
  "2.0.2": {
    Leaderboards: [
      {
        type: "text",
        content: "Panels now feature a blurred background when in dark theme.",
      },
      {
        type: "image",
        content: {
          pc: "https://cdn.namespace.media/s/YobpHtoDxTs2xy4/download/msedge_SyIjOYJM6O.png",
          mobile:
            "https://cdn.namespace.media/s/CciydiNHS78T73g/download/msedge_NuhJRDFfOo.png",
          key: "",
        },
      },
      {
        type: "text",
        content: "Mobile podium panels are now equally sized.",
      },
      {
        type: "image",
        content: {
          pc: "https://cdn.namespace.media/s/T7GyFGrps8e8D66/download/msedge_n851ZhgOdT.png",
          key: "",
        },
      },
    ],
  },

  "2.0.3": {
    "Status Page": [
      {
        type: "text",
        content: "A new Status Page has been added.",
      },
      {
        type: "image",
        content: {
          pc: "https://cdn.namespace.media/s/GxZLijTBD6BxSES/download/OmjcRa4cPE.png",
          key: "",
        },
      },
      {
        type: "text",
        content: "Charts now only display for medium to large viewports.",
      },
      {
        type: "text",
        content:
          "Incidents are now collapsible and optimized for mobile usage.",
      },
      {
        type: "image",
        content: {
          pc: "https://cdn.namespace.media/s/eg68a53AB7XT22r/download/msedge_JZwa3b1FZl.gif",
          mobile:
            "https://cdn.namespace.media/s/TtkSaoY3xcMEHzg/download/msedge_Po4DU0Dzoq.gif",
          key: "",
        },
      },
    ],
    "Page Detail Titles": [
      {
        type: "text",
        content:
          "Page detail titles without an arrow no longer function as a link.",
      },
    ],
  },

  "2.0.4": {
    "Status Page": [
      {
        type: "text",
        content: "Improved appearance of header.",
      },
    ],
  },

  "2.0.5": {
    "Header Behavior": [
      {
        type: "text",
        content: "Some header gradients now adapt to the displayed image.",
      },
      {
        type: "image",
        content: {
          pc: "https://cdn.namespace.media/s/2aPAzFy2BQaH68y/download/msedge_a5llRKBIqi.png",
          mobile:
            "https://cdn.namespace.media/s/L4YKRrHe5W3xp2X/download/msedge_fsxxRhP3Hb.png",
          key: "",
        },
      },
      {
        type: "image",
        content: {
          pc: "https://cdn.namespace.media/s/FQr4z2Dq7aWJYfL/download/msedge_BHGTnKaC1T.png",
          mobile:
            "https://cdn.namespace.media/s/JFqXKcREADSXeRx/download/msedge_NHIlfAFCS4.png",
          key: "",
        },
      },
    ],
  },

  "2.0.6": {
    "Page Loading": [
      {
        type: "text",
        content: "Added loading animation for initial page load.",
      },
      {
        type: "text",
        content: "Added loading animation to guild dashboard.",
      },
    ],
    "Server List": [
      {
        type: "text",
        content:
          "Fixed a sizing bug where some guild icons would randomly appear too large.",
      },
    ],
  },

  "2.0.7": {
    "Server Dashboard": [
      {
        type: "text",
        content: "Improved clustering of icons and corrected tab groups.",
      },
      {
        type: "image",
        content: {
          pc: "https://cdn.namespace.media/s/oqkA6FajA5MYDzM/download/msedge_zrVDYI64fw.png",
          mobile:
            "https://cdn.namespace.media/s/bdpkprBg57gbPdB/download/msedge_U5HKP6q1di.png",
          key: "",
        },
      },
      {
        type: "text",
        content: 'Removed incorrect "back"-arrow from the settings page.',
      },
      {
        type: "text",
        content: "Modules requiring server premium are now correctly disabled.",
      },
      {
        type: "text",
        content:
          "All News and Text channels can now be selected for the Dynamic Leaderboard.",
      },
    ],
    "User Dashboard": [
      {
        type: "text",
        content: "Improved clustering of icons and corrected tab groups.",
      },
      {
        type: "image",
        content: {
          pc: "https://cdn.namespace.media/s/CRneznMDoBeJTMK/download/msedge_yWK07Lkm26.png",
          mobile:
            "https://cdn.namespace.media/s/4sYkrpX9iWjcoYY/download/msedge_gaOxgpCsiu.png",
          key: "",
        },
      },
    ],
  },
  "2.0.8": {
    Legal: [
      {
        type: "text",
        content: "Added Privacy Policy.",
      },
      {
        type: "text",
        content: "Added Safety Guidelines.",
      },
    ],
    "User Dashboard": [
      {
        type: "text",
        content:
          'Added "Report a Bug" button to enable users to report issues more easily.',
      },
    ],
  },
  "2.0.9": {
    Accessibility: [
      {
        type: "text",
        content:
          "Added information tooltips to improve accessibility. (Desktop only)",
      },
      {
        type: "image",
        content: {
          pc: "http://cdn.namespace.media/s/mELEAAfdeKqm6Ew/download/msedge_X2TBMw7Lco.png",
          key: "",
        },
      },
    ],
  },
  "2.0.14": {
    Leaderboards: [
      {
        type: "text",
        content: "Fixed issue where up arrows were displaying incorrectly.",
      },
      {
        type: "text",
        content: 'Restricted "edit" window to premium users only.',
      },
    ],
    Homepage: [
      {
        type: "text",
        content:
          'The "Features" arrow is now displayed in the theme-specific color.',
      },
      {
        type: "text",
        content:
          "The premium subtitle is now displayed in the theme-specific color.",
      },
    ],
  },
  "2.0.15": {
    Blog: [
      {
        type: "text",
        thread_id: "1097100301800059090",
        submitter_id: "242621043561201666",
        submit_type: "suggestion",
        content:
          "Increased the maximum allowed size for blog comments to 1024 characters.",
      },
    ],
    "Server Dashboard": [
      {
        type: "text",
        thread_id: "1095867202248384532",
        submitter_id: "235920335021670400",
        submit_type: "suggestion",
        content:
          "Users can now edit server roles, channels, percentages, and levels directly from the list view.",
      },
      {
        type: "image",
        content: {
          pc: "https://qwq.sh/b71diq",
          key: "",
        },
      },
    ],
  },
  "2.0.16": {
    Changelogs: [
      {
        type: "text",
        content:
          'Implemented a new "Changelogs" page that provides a comprehensive overview of all changes made to the platform over the past several years. This can be found in your profile section.',
      },
      {
        type: "image",
        content: {
          pc: "https://qwq.sh/h1ouc8",
          key: "",
        },
      },
      {
        type: "image",
        content: {
          pc: "https://qwq.sh/wnsb49",
          key: "",
        },
      },
    ],
  },
  "2.0.17": {
    "Server Dashboard": [
      {
        type: "text",
        content: "You can now set levelroles to get assigned at level 0.",
      },
    ],
  },
  "2.0.18": {
    "Status Page": [
      {
        type: "text",
        content: "Implemented IlumV2.",
      },
    ],
    Blog: [
      {
        type: "text",
        content: "Implemented new streamlined blog overview layout.",
      },
    ],
    "Server Dashboard": [
      {
        type: "text",
        content:
          "Updated the description of Values 'Loot XP', 'Roll XP' and 'Fish XP'",
        submit_type: "suggestion",
        submitter_id: "729671721975545978",
      },
    ],
    // "Server Dashboard": [
    //   {
    //     type: "text",
    //     content: "You can now boost and ignore forum channels.",
    //     submit_type: "suggestion",
    //     submitter_id: "242621043561201666",
    //   },
    // ],
  },
};

export default changelogs;
