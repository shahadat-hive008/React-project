
// import { Todo } from "../typescript/interface";

import type { Todo } from "../typescript/interface";


 const seedData = [
  { id: 1, text: 'Learn TypeScript utility types', completed: false, priority: 'High' },
  { id: 2, text: 'Review pending pull requests', completed: true,   priority: 'Medium' },
  { id: 3, text: 'Follow efebaslilar in github', completed: false,  priority: 'Low' },
];

export const seededData : Todo[] = seedData.map((item, index) =>({
  ...item , createdAt : Date.now() - (seedData.length - index) * 1000
})) 