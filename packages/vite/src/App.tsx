import { useState, useCallback } from 'react'
import './App.css'
import useUsersRecoil from './recoil/useUsers.recoil';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import useDelay from './hook/useDelay';

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  age: z.number().min(5),
});
type Schema = z.infer<typeof schema>;

function App() {
  const { users, createUser } = useUsersRecoil();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const create = useCallback(async (name: string, age: number) => {
    const user = await createUser({ name, age });
    reset()
    alert(JSON.stringify(user));
  }, [createUser, reset])

  // const unwrapEV = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   return e?.target?.value || "";
  // }

  const submit = useDelay(handleSubmit((v, e) => {
    v.preventDefault();
    e?.preventDefault();
    create(v.name, v.age);
  }), 1000);

  return (
    <div>
      <form onSubmit={submit}>
        <label>Name:</label>
        <input {...register('name')} />
        {errors.name?.message && <p>{errors.name?.message}</p>}
        <label>Age:</label>
        <input type="number" {...register('age', { valueAsNumber: true })} />
        {errors.age?.message && <p>{errors.age?.message}</p>}
        <input type="submit" onSubmit={(e) => e.preventDefault()} value="Soushin" />
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
