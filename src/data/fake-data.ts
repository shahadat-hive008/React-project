
// import { Todo } from "../typescript/interface";

import type { Todo } from "../typescript/interface";


 const seedData = [
  { id: 1, text: 'Learn TypeScript utility types', completed: false },
  { id: 2, text: 'Review pending pull requests', completed: true },
  { id: 3, text: 'Follow efebaslilar in github', completed: false }
];

export const seededData : Todo[] = seedData.map((item, index) =>({
  ...item , createdAt : Date.now() - (seedData.length - index) * 1000
})) 