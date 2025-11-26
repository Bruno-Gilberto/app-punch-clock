import { usePage } from '@inertiajs/react';

export default function authUser() {
  return usePage().props?.user;
}