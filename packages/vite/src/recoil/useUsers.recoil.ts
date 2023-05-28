import { atom, useRecoilValue, useRecoilCallback } from "recoil";
import axios from "axios";

const id = (new Date()).toDateString();

export type User = {
  id?: number;
  name: string;
  age: number;
};

const getUsersApi = (): Promise<User[]> => {
  return axios
    .get("http://localhost:8000/users")
    .then((res) => JSON.parse(res?.data || "{}"));
};

const createUserApi = (user: User): Promise<User> => {
  return axios
    .post("http://localhost:8000/users", user)
    .then((res) => JSON.parse(res?.data || "{}"));
};

const usersAtom = atom({
  key: `${id}_usersAtom`,
  default: getUsersApi(),
});

const useUsersRecoil = () => {
  const users = useRecoilValue(usersAtom);

  const createUser = useRecoilCallback(({ set }) => async (user: User) => {
    const createdUser: User = await createUserApi(user);
    set(usersAtom, (prev: User[]) => {
      return [...prev, createdUser];
    });
    return createdUser;
  });

  const destroy = useRecoilCallback(
    ({ reset }) =>
      () => {
        reset(usersAtom);
      },
    []
  );

  return {
    users,
    createUser,
    destroy,
  };
};

export default useUsersRecoil;
