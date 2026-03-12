// 主页所有内容均在此配置

const config = {
  name: 'Kangyu YUAN',
  name_cn: '袁康宇',
  title: 'Ph.D. Candidate',
  avatar: '/materials/avatar.jpg',
  bio: `I am currently a Ph.D. candidate at the Hong Kong University of Science and Technology (HKUST), supervised by [Prof. Xiaojuan Ma](https://cse.hkust.edu.hk/~mxj/) since 2024. 
  Before that, I studied and got the degree of B.E. in department of [Artificial Intelligence](https://sai.sysu.edu.cn/) at Sun Yat-sen University from 2020 to 2024, where I received research training from [Prof. Zhenhui Peng](https://zhenhuipeng.com/). 
  My current research interests include **Social Computing** and **Mental Health**. I am committed to sustainable and friendly digital environment building through:`,
  bioList: [
    '(1) Analyzing user interaction patterns & evolvement in digital environment ==(Factors Identification)==',
    '(2) Exploring the potential interventions strategies in a user-center perspective ==(Design Exploration)==.',
    '(3) Introducing social-technical systems to mitigate online harmful behaviors ==(System Application)==.'
  ],
  bioAfterList: `I am currently looking for collaborators on online community sustainability and friendliness. If you are interested in my research topics, please feel free to contact me.`,

  location: 'Hong Kong, China',
  email: 'kyuanaf@connect.ust.hk',
  social: [
    { type: 'github', url: 'https://github.com/Yuanky123' },
    { type: 'scholar', url: 'https://scholar.google.com.hk/citations?user=1EJefeAAAAAJ&hl=it' },
    { type: 'email', url: 'kyuanaf@connect.ust.hk' },
    { type: 'orcid', url: 'https://orcid.org/0009-0001-8460-9651' },
  ],
  topNav: [
    { label: 'Publications', url: '#' },
    // { label: 'CV', url: '#' },
    { label: 'Life', url: '#' },
    // { label: 'Services', url: '#' },
  ],
  education: [
    {
      department: 'Department of Computer Science and Engineering',
      school: 'The Hong Kong University of Science and Technology',
      degree: 'Ph.D. Candidate',
      time: '2024 - Present',
    },
    {
      department: 'Department of Artificial Intelligence',
      school: 'Sun Yat-sen University',
      degree: 'Bachelor of Engineering (B.E.)',
      time: '2020 - 2024',
    },
  ],
  experience: [
    {
      company: '@[HCI Initiative](https://hci.cse.ust.hk/people.html), HKUST, mentored by [Chengbo Zheng ](https://www.cbzheng.link/) in [Prof. Xiaojuan Ma](https://cse.hkust.edu.hk/~mxj/)\'s lab',
      title: 'Research intern',
      time: '2023.06 - 2023.09',
    },
    {
      company: '@HaiA Lab, SYSU, supervised by [Prof. Zhenhui Peng](https://zhenhuipeng.com/)',
      title: 'Research training',
      time: '2022.11 - 2024.06',
    },
  ],
  research: [
    'Research Interest 1',
    'Research Interest 2',
    'Research Interest 3',
  ],
  news: [
    {
      date: 'Apr. 2026',
      content: 'Attend the CHI 2026 in Barcelona, Spain. Glad to present our work!',
    },
    {
      date: 'Mar. 2026',
      content: 'Pass the PhD Qualification Exam. Thanks to all!',
    },
    {
      date: 'Mar. 2026',
      content: 'One **@CHI 2026** first author LBW work accepted. Thanks to all collaborators!',
    },
    {
      date: 'Mar. 2026',
      content: 'One **@CHI 2026** first author paper and Two **@CHI 2026** co-author papers accepted. Congrats and thanks to all!',
    },
    {
      date: 'Mar. 2026',
      content: 'One **@Group** co-author paper accepted. Congrats and thanks to all!',
    },
    {
      date: 'Jun. 2025',
      content: 'One **@CSCW 2025** co-author paper accepted. Congrats and thanks to all!',
    },
    {
      date: 'Apr. 2025',
      content: 'Attend the CHI 2025 in Yokohama, Japan. Glad to present our poster!',
    },
    {
      date: 'Mar. 2025',
      content: 'One **@CSCW 2025** co-author paper accepted. Congrats and Thanks to all!',
    },
    {
      date: 'Feb. 2025',
      content: 'One **@CHI 2025** LBW work accepted. Thanks to all collaborators!',
    },
    {
      date: 'Sep. 2024',
      content: 'Join HKUST as a Ph.D. student supervised by Prof. Xiaojuan Ma! Looking forward to the new journey!',
    },
    {
      date: 'Jun. 2024',
      content: 'Graduate from SYSU with a B.E. in Artificial Intelligence. Thanks to all people I met and worked with!',
    },
    {
      date: 'Feb. 2024',
      content: 'One **@CHI 2024** co-author LBW work accepted. Thanks to all!',
    },
    {
      date: 'Jan. 2024',
      content: 'One **@CHI 2024** co-author paper accepted. Congrats and Thanks to all!',
    },
    {
      date: 'Jun. 2023',
      content: 'One **@UIST 2023** co-first author paper accepted. Thanks to all my collaborators!',
    },
  ],
  papers: [
    {
      title: '[CHI 2026] "Exploring Aggressors\' In-Match Cognitive and Emotional Formation and Toxic Behavior Trajectories in MOBA Games',
      authors: '==Kangyu YUAN==, Hanfang Lyu, Runhua Zhang, Hansika Murugu, Xiaojuan Ma',
      venue: 'CHI',
      year: '2026',
      link: '/src/Papers/chi26-10.pdf',
    },
    {
      title: '[CHI EA 2026] "AI Clone Companions and “Dream Girl” Fans: How Idol-Based Agents Reshape Parasocial Relationships Across Real and Virtual Domains',
      authors: '==Kangyu YUAN==, Tak Kwan Wang, Jiachen Du, Yuanhao Zhang, Ziqi Pan, Xiaojuan Ma',
      venue: 'CHI EA',
      year: '2026',
      link: '/src/Papers/chiea26-293.pdf',
    },
    {
      title: '[CHI EA 2025] "I Love the Internet Again": Exploring the Interaction Inception of "TikTok Refugees" Flocking into RedNote',
      authors: '==Kangyu YUAN==, Li Zhang, Hanfang Lyu, Ziqi Pan, Yuanhao Zhang, Junze Li, Bingcan Guo, Jiaxiong Hu, Qingyu Guo, Xiaojuan Ma',
      venue: 'CHI EA',
      year: '2025',
      link: 'https://dl.acm.org/doi/full/10.1145/3706599.3719738',
    },
    {
      title: '[CHI EA 2024] Exploring the Evolvement of Artwork Descriptions in Online Creative Community under the Surge of Generative AI: A Case Study of DeviantArt',
      authors: 'Qingyu Guo, ==Kangyu YUAN==, Changyang He, Zhenhui Peng, Xiaojuan Ma',
      venue: 'CHI EA',
      year: '2024',
      link: 'https://dl.acm.org/doi/full/10.1145/3613905.3650851',
    },
    {
      title: '[CHI 2024] Charting the Future of AI in Project-Based Learning: A Co-Design Exploration with Students',
      authors: 'Chengbo Zheng, ==Kangyu YUAN==, Bingcan Guo, Reza Hadi Mogavi, Zhenhui Peng, Shuai Ma, Xiaojuan Ma',
      venue: 'CHI',
      year: '2024',
      link: 'https://dl.acm.org/doi/full/10.1145/3613904.3642807',
    },
    {
      title: '[UIST 2023] CriTrainer: An Adaptive Training Tool for Critical Paper Reading',
      authors: '==Kangyu YUAN==, **Hehai Lin**, **Shilei Cao**, Zhenhui Peng, Qingyu Guo, Xiaojuan Ma',
      venue: 'UIST',
      year: '2023, co-first author',
      link: 'https://dl.acm.org/doi/abs/10.1145/3586183.3606816',
    },
  ],
  projects: [
    {
      name: 'Project Name',
      desc: 'Project Description',
      link: '#',
    },
  ],
};

export default config; 