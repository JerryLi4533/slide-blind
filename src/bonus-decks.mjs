import { T, I, S, sub } from './content-helpers.mjs';

export const bonusDecks = [
  {
    id:'bookmark-university', title:T('收藏夹：一所永不毕业的大学','Bookmark University: Nobody Graduates'), category:T('数字生活 × 知识管理','Digital life × Learning'), description:T('从收藏即学会，到为未读资料建立招生办。','From saving as learning to recruiting for an unread library.'), collection:'new', theme:'cream', accent:'orange',
    slides:[
      S('cover','我没学会，但我的收藏夹学会了','I Haven’t Learned It. My Bookmarks Have.',{image:'image131',...sub('关于知识能否通过点击实现远程转移的研究','A study of knowledge transfer through a single click.')}),
      S('timeline','一门课程的完整生命周期','The Complete Life Cycle of a Course',{items:[I('23:41','23:41','发现“十分钟精通”教程','Find a “master it in ten minutes” tutorial.'),I('23:42','23:42','收藏，建立专用文件夹','Save it. Create a dedicated folder.'),I('23:43','23:43','奖励自己刷半小时视频','Celebrate with thirty minutes of videos.')]}),
      S('formula','学习效率，取决于文件夹命名','Learning Efficiency Depends on Folder Names',{formula:T('掌握感 = 收藏数 × 文件夹专业度','Feeling of mastery = saves × folder prestige'),image:'image101',items:[I('新建文件夹','New folder','知识尚未入学','Knowledge has not enrolled.'),I('核心能力·进阶','Core Skills: Advanced','已经可以更新简历','Time to update the résumé.')]}),
      S('table','本校设有三个学院','Our University Has Three Faculties',{items:[I('以后再看学院','Read Later','招生人数无限，开学日期待定','Unlimited places; start date pending.'),I('可能有用学院','Might Be Useful','专业方向取决于下一份工作','Major depends on the next job.'),I('忘了为什么学院','Why Did I Save This?','保留现场，等待考古','Preserve the site for archaeologists.')]}),
      S('chat','招生办来电话了','A Call from Admissions',{image:'image106',items:[I('朋友','Friend','上次那篇教程学了吗？','Did you study that tutorial?'),I('我','Me','已经纳入个人知识体系。','It is in my knowledge system.'),I('朋友','Friend','怎么操作？','How does it work?'),I('我','Me','我先找一下知识体系。','Let me find the knowledge system.')]}),
      S('compare','看完一篇，还是收藏十篇？','Read One or Save Ten?',{items:[I('看完一篇','Read one','发现九个不懂的问题，信心下降','Discover nine unknowns. Lose confidence.'),I('收藏十篇','Save ten','增加十项潜在技能，信心上升','Gain ten potential skills. Feel brilliant.')],...sub('以上为虚构学习策略，不构成毕业资格。','Fictional learning strategies; no degree awarded.')}),
      S('twist','最大的风险：真的有人请你教','The Biggest Risk: Someone Asks You to Teach',{image:'image112',...sub('你拥有完整的课程目录，但不拥有第一节课。','You own the full syllabus, but not lesson one.')}),
      S('steps','紧急开课方案','Emergency Teaching Plan',{items:[I('第一步','Step 1','请大家先看我收藏的资料','Ask everyone to read your saved resources.'),I('第二步','Step 2','组织分享，了解大家学到了什么','Invite everyone to share what they learned.'),I('第三步','Step 3','认真听讲，现场完成自己的学习','Listen carefully. Finally learn the topic.')]}),
      S('statement','如果链接失效，算不算知识蒸发？','If the Link Dies, Does Knowledge Evaporate?',{image:'image110',...sub('本校现决定：为防止知识流失，先截图，再也不看。','New policy: prevent knowledge loss with screenshots nobody opens.')}),
      S('finale','谢谢，建议收藏本次演讲','Thank You. Please Bookmark This Talk.',{image:'image109',...sub('毕业要求：至少打开一个文件夹。','Graduation requirement: open at least one folder.')})
    ]
  },
  {
    id:'alarm-diplomacy',title:T('闹钟是与明天的我进行外交谈判','Alarm Clocks Are Diplomatic Negotiations'),category:T('早起 × 国际关系','Mornings × Diplomacy'),description:T('五个闹钟、三轮停火和一场被窝主权争端。','Five alarms, three ceasefires, and a dispute over duvet sovereignty.'),collection:'new',theme:'noir',accent:'blue',
    slides:[
      S('cover','每天早上，我与自己断交五次','Every Morning, I Cut Ties with Myself Five Times',{image:'image143',...sub('被窝共和国与工作日联盟的边境观察','Border observations: the Duvet Republic and the Weekday Alliance.')}),
      S('table','五个闹钟，五种外交措辞','Five Alarms. Five Diplomatic Messages.',{items:[I('07:00','07:00','友好提醒：新的一天开始了','Friendly reminder: a new day begins.'),I('07:05','07:05','严正交涉：请尊重昨晚的承诺','Formal protest: honor last night’s promise.'),I('07:10','07:10','最后通牒：你还洗不洗头','Ultimatum: do you still plan to wash your hair?')]}),
      S('compare','签约方与履约方不是同一个人','The Signatory Is Not the One Who Must Deliver',{items:[I('昨晚的我','Last night’s me','精神饱满，承诺晨跑、做饭、背单词','Promises a run, breakfast, and vocabulary drills.'),I('早上的我','Morning me','拒绝承认前任政府签署的条约','Rejects all treaties signed by the previous government.')]}),
      S('formula','再睡五分钟，是一笔外交贷款','Five More Minutes Is a Diplomatic Loan',{formula:T('赖床利息 = 延迟分钟 × 出门加速度','Snooze interest = minutes delayed × exit acceleration'),image:'image130',items:[I('借款时','At borrowing','只是五分钟，影响不大','Only five minutes. Barely matters.'),I('还款时','At repayment','穿袜子与刷牙必须同时发生','Put on socks while brushing teeth.')]}),
      S('chat','停火协议第三轮','Ceasefire Talks, Round Three',{items:[I('闹钟','Alarm','根据协议，你已经醒了。','Under the treaty, you are awake.'),I('我','Me','眼睛醒了，其他部门还没批准。','My eyes are awake. Other departments have not approved.'),I('闹钟','Alarm','请给出具体时间。','Please give an exact time.'),I('我','Me','等这首铃声结束。','When this ringtone ends.')]}),
      S('evidence','为什么周末能自然醒？','Why Can We Wake Up Naturally on Weekends?',{image:'image86',items:[I('没有外敌','No external enemy','被窝边境不再需要驻军','The duvet border needs no troops.'),I('没有任务','No assigned mission','身体主动展示工作日拒绝提供的能力','The body reveals skills withheld on weekdays.')]}),
      S('twist','对方突然宣布：今天调休上班','Breaking News: Today Is a Make-Up Workday',{image:'image110',...sub('周末政府拒绝接收这份通知，并把手机翻了过去。','The weekend government rejects the notice and turns the phone over.')}),
      S('steps','和平解决方案：把手机放远','Peace Plan: Put the Phone Across the Room',{items:[I('预期','Expected','必须下床，谈判结束','Must leave bed. Negotiations end.'),I('实际','Actual','下床关掉，迅速撤回本土','Get up, silence it, retreat to home territory.'),I('升级','Escalation','把闹钟放在咖啡机旁边','Move the alarm beside the coffee machine.')]}),
      S('statement','真正的外交官：猫','The Real Diplomat: the Cat',{image:'image153',...sub('它不谈时间，只谈早餐；也不接受暂停九分钟。','It negotiates breakfast, not time. A nine-minute snooze is unacceptable.')}),
      S('finale','明天一定早起，条约今晚签','Tomorrow We Rise Early. Sign the Treaty Tonight.',{image:'image102',...sub('本次协议的有效期：睡着之前。','This agreement remains valid until we fall asleep.')})
    ]
  },
  {
    id:'remote-sovereignty',title:T('谁掌握空调遥控器，谁掌握夏天','Whoever Holds the Remote Owns Summer'),category:T('居家生活 × 地缘政治','Home life × Geopolitics'),description:T('围绕26度建立家庭宪法，再发现遥控器没电了。','Build a household constitution around 26°C, then discover dead batteries.'),collection:'new',theme:'mint',accent:'green',
    slides:[
      S('cover','空调遥控器，是家庭最高权力','The AC Remote Is the Highest Power in the Home',{image:'image99',...sub('一场关于两度温差的长期边境冲突','A long-running border conflict over two degrees Celsius.')}),
      S('table','家里有三个气候带','The Home Has Three Climate Zones',{items:[I('沙发寒带','Sofa tundra','正对出风口，主张28°C','Under the vent; demands 28°C.'),I('厨房热带','Kitchen tropics','还在炒菜，主张18°C','Still cooking; demands 18°C.'),I('走廊温带','Hallway temperate zone','路过五秒，宣布大家都太夸张','Walks through for five seconds; calls everyone dramatic.')]}),
      S('formula','体感温度不是温度','Perceived Temperature Is Not Temperature',{formula:T('体感温度 = 室温 + 谁付电费','Perceived temperature = room temperature + who pays'),image:'image106',items:[I('付款人','Bill payer','看到设定24°C，立刻觉得冷','Sees a 24°C setting. Instantly feels cold.'),I('被付款人','Everyone else','盖着毯子，仍坚持开低一点','Under a blanket. Still asks for colder.')]}),
      S('chat','26度停战协议','The 26°C Ceasefire',{items:[I('甲方','Party A','26度，都退一步。','26°C. We both compromise.'),I('乙方','Party B','可以，但风不能对着我。','Fine, but no air directly at me.'),I('甲方','Party A','那转到你旁边。','I’ll aim beside you.'),I('旁边的人','Person beside them','为什么没有邀请我参加谈判？','Why was I excluded from these talks?')]}),
      S('compare','名义主权与实际控制','Nominal Sovereignty vs Actual Control',{items:[I('名义持有人','Nominal holder','手里拿着遥控器，对外宣布26°C','Holds the remote. Publicly announces 26°C.'),I('实际控制人','Actual controller','手机也能控制，默默改回23°C','Uses the phone app. Quietly restores 23°C.')]}),
      S('evidence','边境冲突开始扩散','The Border Dispute Spreads',{image:'image110',items:[I('门','The door','关门防冷气外流，还是开门保持通风','Close it to retain cool air, or open it to ventilate?'),I('毯子','The blanket','是人道物资，还是对政策的无声抗议','Humanitarian aid, or a silent policy protest?'),I('电费单','The bill','月底发布，足以推翻全部口头协议','Published monthly. Overrides every verbal agreement.')]}),
      S('twist','双方争吵半小时，空调没开','Thirty Minutes of Debate. The AC Was Never On.',{image:'image112',...sub('遥控器显示26°C，但电池已经失去履约能力。','The remote shows 26°C. Its batteries cannot enforce the agreement.')}),
      S('steps','紧急权力交接流程','Emergency Transfer of Power',{items:[I('取证','Gather evidence','对着空调连按三次，看有没有“滴”','Press three times. Listen for a beep.'),I('接管','Take control','借用电视遥控器的电池','Borrow batteries from the TV remote.'),I('新危机','New crisis','现在电视阵营要求归还资源','The television faction demands its resources back.')]}),
      S('statement','最终的中立区：商场','The Final Neutral Zone: the Mall',{image:'image135',...sub('温度不用决定，电费不用承担，但会产生奶茶开支。','No temperature decisions or electricity bills. Bubble-tea expenses may apply.')}),
      S('finale','愿世界和平，先把风向调一下','May Peace Prevail. First, Adjust the Vent.',{image:'image109',...sub('本次会议一致通过：遥控器由离它最近的人保管。','Unanimous resolution: the nearest person keeps the remote.')})
    ]
  },
  {
    id:'sock-migration',title:T('失踪的袜子正在申请跨宇宙移民','Missing Socks Are Applying for Interdimensional Residency'),category:T('家务 × 宇宙移民','Housework × Cosmic migration'),description:T('从洗衣机人口普查到单只袜子的外交保护。','From a washing-machine census to diplomatic protection for single socks.'),collection:'new',theme:'cosmic',accent:'blue',
    slides:[
      S('cover','洗衣机不是家电，是出入境口岸','The Washing Machine Is a Border Checkpoint',{image:'image84',...sub('关于每次洗衣后少一只袜子的统一解释','A unified theory of the sock missing after every wash.')}),
      S('timeline','一次洗衣的人口普查','A Laundry Census',{items:[I('入境','Arrival','投入六双袜子，共十二只','Six pairs enter: twelve socks.'),I('边检','Border control','旋转四十五分钟，禁止探视','Forty-five minutes of spinning. No visitors.'),I('出境','Departure','十一只离开，一只去向不明','Eleven emerge. One destination unknown.')]}),
      S('table','排除三个常见解释','Eliminating Three Common Explanations',{image:'image113',items:[I('掉床底了','Under the bed','找到一只，但颜色属于去年','Found one. Its color belongs to last year.'),I('粘裤腿了','Inside a trouser leg','摸到纸巾，没有找到公民','Found a tissue, not a citizen.'),I('被猫叼走了','Taken by the cat','嫌疑猫拒绝配合，正在睡觉','The suspect refuses cooperation. Currently asleep.')]}),
      S('formula','为什么必须开到脱水档？','Why Does It Require the Spin Cycle?',{formula:T('离境意愿 = 旋转速度 × 对另一只的厌倦','Exit motivation = spin speed × pair fatigue'),items:[I('旋转速度','Spin speed','提供理论上的宇宙出发条件','Provides theoretical launch conditions.'),I('配对疲劳','Pair fatigue','从出厂开始，永远穿同一套衣服','Wearing the same outfit together since manufacture.')],...sub('纯属虚构的袜子社会学，没有真实物理含义。','Fictional sock sociology, with no real physical meaning.')}),
      S('chat','来自平行宇宙的一封回信','A Reply from the Parallel Universe',{image:'image91',items:[I('失踪袜子','Missing sock','已安顿，勿念。这里不用配对。','Settled in. Don’t worry. No pairing required here.'),I('主人','Owner','你另一半怎么办？','What about your other half?'),I('失踪袜子','Missing sock','请尊重独立个体。','Please respect individual autonomy.')]}),
      S('compare','留守袜子的两条职业道路','Two Careers for the Sock Left Behind',{items:[I('继续等待','Keep waiting','留在抽屉，直到另一只的花纹被忘记','Wait in a drawer until nobody remembers the pattern.'),I('重新就业','Retrain','转任擦灰手套，实现职业第二春','Become a dusting glove. Start a second career.')]}),
      S('twist','失踪袜子回来了，但它不是原来那只','The Sock Returns. But It Is the Wrong Sock.',{image:'image110',...sub('尺码更小，颜色不同；家里没有人承认买过它。','Smaller size. Different color. Nobody admits buying it.')}),
      S('steps','建立洗衣边境管理制度','Establish Laundry Border Controls',{items:[I('成双入袋','Paired entry','使用洗衣袋，团体办理签证','Use a laundry bag. Apply for a group visa.'),I('清点出境','Departure count','晾晒前核对，不接受“差不多”','Count before drying. “Close enough” is not valid.'),I('保留申诉','Right of appeal','单只袜子进入候补家庭登记册','Register single socks for a new household.')]}),
      S('statement','漏洞：整只洗衣袋也不见了','The Loophole: the Entire Laundry Bag Is Missing',{image:'image112',...sub('我们原本阻止个体移民，现在提供了团体旅行服务。','We tried to prevent individual migration. We created group tourism.')}),
      S('finale','别再找了，它可能过得比你好','Stop Searching. It May Be Living Better Than You.',{image:'image149',...sub('下次买袜子，买十双同款。让宇宙也分不清。','Next time, buy ten identical pairs. Confuse the universe too.')})
    ]
  }
];
