export interface Package {
  id: string;
  limit: string;
  fee: string;
  feeKobo: number;
  badge?: string;
  popular?: boolean;
}

export const packages: Package[] = [
  { id: 'p1', limit: 'KSh 5,000', fee: 'KSh 250', feeKobo: 25000 },
  { id: 'p2', limit: 'KSh 7,500', fee: 'KSh 300', feeKobo: 30000 },
  { id: 'p3', limit: 'KSh 10,000', fee: 'KSh 350', feeKobo: 35000, popular: true, badge: 'Most Recommended' },
  { id: 'p4', limit: 'KSh 12,500', fee: 'KSh 400', feeKobo: 40000 },
  { id: 'p5', limit: 'KSh 16,000', fee: 'KSh 450', feeKobo: 45000 },
  { id: 'p6', limit: 'KSh 21,000', fee: 'KSh 500', feeKobo: 50000 },
  { id: 'p7', limit: 'KSh 25,000', fee: 'KSh 550', feeKobo: 55000 },
  { id: 'p8', limit: 'KSh 30,000', fee: 'KSh 600', feeKobo: 60000 },
  { id: 'p9', limit: 'KSh 35,000', fee: 'KSh 650', feeKobo: 65000 },
  { id: 'p10', limit: 'KSh 40,000', fee: 'KSh 700', feeKobo: 70000 },
  { id: 'p11', limit: 'KSh 45,000', fee: 'KSh 750', feeKobo: 75000 },
  { id: 'p12', limit: 'KSh 50,000', fee: 'KSh 800', feeKobo: 80000 },
  { id: 'p13', limit: 'KSh 60,000', fee: 'KSh 850', feeKobo: 85000 },
  { id: 'p14', limit: 'KSh 70,000', fee: 'KSh 900', feeKobo: 90000 },
];

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Amina K.',
    location: 'Nairobi',
    text: 'Nilikuwa na limit ya 2k tu, within 10 minutes nimepata 25k. Process ni faster sana, hakla stress.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Brian O.',
    location: 'Mombasa',
    text: 'Biashara yangu ilikuwa inasumbua sana na stock. Baada ya ku-boost, sasa niko sorted mid-month. Asante sana!',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Wanjiru M.',
    location: 'Nakuru',
    text: 'Mwanzo nilikuwa na doubt, lakini kila kitu ni transparent. Hakuna hidden charges, limit ika-show immediately. Noma!',
    rating: 5,
  },
  {
    id: 't4',
    name: 'David L.',
    location: 'Eldoret',
    text: 'Limit yangu ili-move kutoka 2k hadi 70k chini ya 10 mins. Kama unatumia mobile money daily, hii ni game changer.',
    rating: 5,
  },
  {
    id: 't5',
    name: 'Mercy A.',
    location: 'Kisumu',
    text: 'Process ni clean sana. Business limit yangu sasa ni boosted. Nimeshukuru sana, hii service ni safi.',
    rating: 5,
  },
  {
    id: 't6',
    name: 'Kevin M.',
    location: 'Thika',
    text: 'One-time fee tu, hakuna subscription — ndio ili-niconvince. Boosted mara moja na limit imekaa. Chunguza!',
    rating: 4,
  },
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: 'f1',
    question: 'How long does the boost take to reflect?',
    answer: 'Typically applied within 5 to 10 minutes after processing. You will receive a confirmation notification once the new limit is active.',
  },
  {
    id: 'f2',
    question: 'Is my PIN required?',
    answer: 'No. You only enter your PIN on the official mobile money prompt on your phone. We never ask for or store your PIN.',
  },
  {
    id: 'f3',
    question: 'Is this a subscription?',
    answer: 'No. It is a one-time fee per boost. There are no recurring charges or hidden subscriptions.',
  },
  {
    id: 'f4',
    question: 'What do I need to qualify?',
    answer: 'An active mobile money account with a good repayment history. The better your history, the higher the limit you can unlock.',
  },
  {
    id: 'f5',
    question: 'Can I boost more than once?',
    answer: 'Yes. As you continue using mobile money and repaying on time, you become eligible for higher tiers. You can boost again after your current limit is fully utilized and repaid.',
  },
  {
    id: 'f6',
    question: 'Is this a real service?',
    answer: 'No. This is a fictional, educational demo built for learning web development. It is not affiliated with any real mobile money provider, and no actual transactions take place.',
  },
];

export interface ActivityItem {
  id: string;
  phone: string;
  amount: string;
  time: string;
}

export const activityFeed: ActivityItem[] = [
  { id: 'a1', phone: '0712****45', amount: 'KSh 25,000', time: 'just now' },
  { id: 'a2', phone: '0733****12', amount: 'KSh 10,000', time: '2 min ago' },
  { id: 'a3', phone: '0790****88', amount: 'KSh 50,000', time: '5 min ago' },
  { id: 'a4', phone: '0722****03', amount: 'KSh 7,500', time: '8 min ago' },
  { id: 'a5', phone: '0768****91', amount: 'KSh 15,000', time: '12 min ago' },
  { id: 'a6', phone: '0701****37', amount: 'KSh 3,000', time: '15 min ago' },
  { id: 'a7', phone: '0745****60', amount: 'KSh 25,000', time: '18 min ago' },
  { id: 'a8', phone: '0719****22', amount: 'KSh 50,000', time: '22 min ago' },
];
