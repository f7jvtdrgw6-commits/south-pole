/* South Pole example data only. Every name, dollar amount and date here is made up
   for the mockup. Do not ship real customer PII in this file. */
window.SPDATA = {
  example: true,
  updated: '2026-10-24T21:20:00-05:00',
  season: 2026,
  stores: {
    all: {id:'all', name:'All', short:'All'},
    stp: {id:'stp', name:'St. Peters', short:'SP', code:'SNOCRAVE'},
    ev:  {id:'ev',  name:'Ellisville', short:'EV',  code:'SNOFIX'}
  },
  /* Season-to-date home tiles. Date range does not apply on Home (matches the mockup). */
  home: {
    all: {revenue:48920, vsPrev:11.4, prevRevenue:43914, tickets:6412, avg:7.63, customers:412, neu:318, ret:94, roas:4.1, spend:842, cpr:2.93, pool:299, poolStore:'St. Peters', low:3, lowItems:'Mango, cups, gummies',
          funnel:{loaded:2400, claimed:612, claimedPct:25.5, redeemed:287, redeemPct:47}},
    stp: {revenue:30612, vsPrev:13.1, prevRevenue:27066, tickets:4014, avg:7.63, customers:248, neu:186, ret:62, roas:4.6, spend:510, cpr:2.51, pool:299, poolStore:'St. Peters', low:1, lowItems:'Tiger’s Blood',
          funnel:{loaded:1400, claimed:412, claimedPct:29.4, redeemed:203, redeemPct:49}},
    ev:  {revenue:18308, vsPrev:8.6, prevRevenue:16858, tickets:2398, avg:7.63, customers:164, neu:132, ret:32, roas:3.2, spend:332, cpr:3.95, pool:180, poolStore:'Ellisville', low:3, lowItems:'Mango, cups, gummies',
          funnel:{loaded:1000, claimed:200, claimedPct:20.0, redeemed:84, redeemPct:42}}
  },
  ads: {
    all: {
      '7d':  {spend:186, roas:3.4, redeemerRev:632, cpr:3.32, cprDelta:-0.12, claimed:48, redeemed:22, rate:46},
      '30d': {spend:842, roas:4.1, redeemerRev:3451, cpr:2.93, cprDelta:-0.40, claimed:612, redeemed:287, rate:47},
      'ytd': {spend:4210, roas:3.8, redeemerRev:15980, cpr:3.11, cprDelta:-0.18, claimed:1840, redeemed:1354, rate:74}
    },
    stp: {
      '7d':  {spend:112, roas:3.9, redeemerRev:437, cpr:2.87, cprDelta:-0.20, claimed:32, redeemed:16, rate:50},
      '30d': {spend:510, roas:4.6, redeemerRev:2346, cpr:2.51, cprDelta:-0.44, claimed:412, redeemed:203, rate:49},
      'ytd': {spend:2580, roas:4.3, redeemerRev:11094, cpr:2.68, cprDelta:-0.22, claimed:1240, redeemed:962, rate:78}
    },
    ev: {
      '7d':  {spend:74, roas:2.6, redeemerRev:195, cpr:4.11, cprDelta:0.18, claimed:16, redeemed:6, rate:38},
      '30d': {spend:332, roas:3.2, redeemerRev:1105, cpr:3.95, cprDelta:-0.21, claimed:200, redeemed:84, rate:42},
      'ytd': {spend:1630, roas:3.0, redeemerRev:4886, cpr:4.16, cprDelta:0.10, claimed:600, redeemed:392, rate:65}
    }
  },
  funnels: {
    all: [{id:'stp', loaded:1400, claimed:412, redeemed:203, roas:4.6},{id:'ev', loaded:1000, claimed:200, redeemed:84, roas:3.2}],
    stp: [{id:'stp', loaded:1400, claimed:412, redeemed:203, roas:4.6}],
    ev:  [{id:'ev',  loaded:1000, claimed:200, redeemed:84, roas:3.2}]
  },
  tests: [
    {id:'a', variant:'A', name:'Free topping', shown:1180, claim:31, cpa:2.41, store:'all'},
    {id:'b', variant:'B', name:'$2 off', shown:1220, claim:20, cpa:3.48, store:'all'},
    {id:'c', variant:'A', name:'BOGO kids', shown:640, claim:27, cpa:2.77, store:'stp'},
    {id:'d', variant:'B', name:'Free size-up', shown:180, claim:null, cpa:null, store:'ev', note:'n<200'}
  ],
  sales: {
    all: {today:1284, todayDelta:12, todayTickets:171, week:6912, weekDelta:4, weekTickets:902, month:24380, monthDelta:-3, monthTickets:3245, avg:7.51, avgDelta:0.22, coupon:3451, couponPct:14, organic:20929, organicPct:86,
          items:[{name:"Tiger’s Blood · Lg", qty:612, rev:4896},{name:"Blue Raspberry · Md", qty:540, rev:3240},{name:"Mango · Kids", qty:401, rev:1604},{name:"Cream topping", qty:488, rev:732}]},
    stp: {today:780, todayDelta:15, todayTickets:102, week:4210, weekDelta:6, weekTickets:548, month:15346, monthDelta:-1, monthTickets:2014, avg:7.62, avgDelta:0.18, coupon:2346, couponPct:15, organic:13000, organicPct:85,
          items:[{name:"Tiger’s Blood · Lg", qty:390, rev:3120},{name:"Blue Raspberry · Md", qty:320, rev:1920},{name:"Cream topping", qty:280, rev:420},{name:"Mango · Kids", qty:210, rev:840}]},
    ev:  {today:504, todayDelta:8, todayTickets:69, week:2702, weekDelta:1, weekTickets:354, month:9034, monthDelta:-6, monthTickets:1231, avg:7.34, avgDelta:0.11, coupon:1105, couponPct:12, organic:7929, organicPct:88,
          items:[{name:"Tiger’s Blood · Lg", qty:222, rev:1776},{name:"Blue Raspberry · Md", qty:220, rev:1320},{name:"Mango · Kids", qty:191, rev:764},{name:"Cream topping", qty:208, rev:312}]}
  },
  inventory: {
    stp: [
      {name:"Tiger’s Blood syrup", cat:'syrups', have:3, max:12, unit:'gal', low:true, reorder:{qty:'6 gal', cost:144}},
      {name:"Mango syrup", cat:'syrups', have:5, max:8, unit:'gal', low:false},
      {name:"Blue Raspberry syrup", cat:'syrups', have:8, max:12, unit:'gal', low:false},
      {name:"Ice blocks", cat:'ice', have:44, max:60, unit:'', low:false},
      {name:"Cups · 16 oz", cat:'cups', have:640, max:1000, unit:'', low:false},
      {name:"Cups · 12 oz", cat:'cups', have:410, max:800, unit:'', low:false},
      {name:"Sweet cream", cat:'toppings', have:6, max:10, unit:'qt', low:false},
      {name:"Gummy bears", cat:'toppings', have:4, max:6, unit:'lb', low:false}
    ],
    ev: [
      {name:"Mango syrup", cat:'syrups', have:1, max:8, unit:'gal', low:true, reorder:{qty:'4 gal', cost:96}},
      {name:"Cups · 16 oz", cat:'cups', have:220, max:1000, unit:'', low:true, reorder:{qty:'2 cases', cost:148}},
      {name:"Gummy bears", cat:'toppings', have:2, max:6, unit:'lb', low:true, reorder:{qty:'3 lb', cost:27}},
      {name:"Tiger’s Blood syrup", cat:'syrups', have:6, max:12, unit:'gal', low:false},
      {name:"Blue Raspberry syrup", cat:'syrups', have:9, max:12, unit:'gal', low:false},
      {name:"Ice blocks", cat:'ice', have:38, max:60, unit:'', low:false},
      {name:"Cups · 12 oz", cat:'cups', have:510, max:800, unit:'', low:false},
      {name:"Sweet cream", cat:'toppings', have:4, max:10, unit:'qt', low:false}
    ]
  },
  /* Fictional customers, abbreviated last names, no phones or emails. */
  customers: [
    {id:'c1', name:'Ava T.', initials:'AV', store:'stp', code:'SNOCRAVE-A41', codeFamily:'SNOCRAVE', claimed:'2026-10-03', redeemed:'2026-10-05', spent:38.50, visits:3, avg:12.83, status:'repeat', variant:'A',
      visitsList:[{date:'Oct 19', item:"Large · Tiger’s Blood", amt:13.50},{date:'Oct 12', item:'Medium · Mango', amt:9.00},{date:'Oct 5', item:'Medium · Blue Raspberry', amt:16.00}]},
    {id:'c2', name:'Liam C.', initials:'LI', store:'ev', code:'SNOFIX-B12', codeFamily:'SNOFIX', claimed:'2026-10-06', redeemed:'2026-10-06', spent:12.00, visits:1, avg:12.00, status:'redeemed', variant:'B',
      visitsList:[{date:'Oct 6', item:'Large · Tiger’s Blood', amt:12.00}]},
    {id:'c3', name:'Mia B.', initials:'MI', store:'stp', code:'SNOCRAVE-B07', codeFamily:'SNOCRAVE', claimed:'2026-10-09', redeemed:null, spent:0, visits:0, avg:0, status:'claimed', variant:'B', visitsList:[]},
    {id:'c4', name:'Noah P.', initials:'NO', store:'stp', code:'SNOCRAVE-A88', codeFamily:'SNOCRAVE', claimed:'2026-09-28', redeemed:'2026-09-30', spent:61.25, visits:5, avg:12.25, status:'repeat', variant:'A',
      visitsList:[{date:'Oct 19', item:"Large · Tiger’s Blood", amt:13.50},{date:'Oct 11', item:'Medium ×2', amt:18.00},{date:'Oct 4', item:'Kids · Blue Raspberry', amt:6.25},{date:'Oct 1', item:'Large · Mango', amt:13.00},{date:'Sep 30', item:'Medium · Cream', amt:10.50}]},
    {id:'c5', name:'Zoe R.', initials:'ZO', store:'ev', code:'SNOFIX-A33', codeFamily:'SNOFIX', claimed:'2026-10-11', redeemed:'2026-10-12', spent:9.75, visits:1, avg:9.75, status:'redeemed', variant:'A',
      visitsList:[{date:'Oct 12', item:'Kids · Mango', amt:9.75}]},
    {id:'c6', name:'Ethan M.', initials:'ET', store:'ev', code:'SNOFIX-A02', codeFamily:'SNOFIX', claimed:'2026-10-14', redeemed:null, spent:0, visits:0, avg:0, status:'claimed', variant:'A', visitsList:[]},
    {id:'c7', name:'Lily N.', initials:'LY', store:'stp', code:'SNOCRAVE-A15', codeFamily:'SNOCRAVE', claimed:'2026-10-02', redeemed:'2026-10-04', spent:24.00, visits:2, avg:12.00, status:'repeat', variant:'A',
      visitsList:[{date:'Oct 18', item:'Large · Blue Raspberry', amt:12.00},{date:'Oct 4', item:'Large · Tiger’s Blood', amt:12.00}]}
  ],
  staff: [
    {name:'Jordan Hale', role:'Store lead', store:'stp', shift:'Opens · Wed–Sun'},
    {name:'Sam Rivera', role:'Shift lead', store:'stp', shift:'Middays · Thu–Mon'},
    {name:'Casey Moon', role:'Team member', store:'stp', shift:'Evenings · Fri–Sun'},
    {name:'Riley Brooks', role:'Store lead', store:'ev', shift:'Opens · Tue–Sat'},
    {name:'Quinn Ellis', role:'Team member', store:'ev', shift:'Evenings · Thu–Sun'}
  ],
  tasks: [
    {title:'Reorder mango syrup', store:'ev', due:'This week', tone:'red'},
    {title:'Order 16 oz cups', store:'ev', due:'This week', tone:'red'},
    {title:'Refill SNOCRAVE code pool', store:'stp', due:'Soon', tone:'gold'},
    {title:'Check weekend closer coverage', store:'all', due:'Friday', tone:''}
  ]
};
