// src/index.ts

export type User = {
  name: string;
  email: string;
  age: number;
};

export function greet(user: User): string {
  return `Hello, ${user.name}!`;
}
