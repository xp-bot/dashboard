import { LoginStatus, useUser } from 'context/user-context';
import { isEqual, isUndefined } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useAccessRestriction(
  loginRequired: boolean,
  devRequired: boolean,
  redirectDomain?: string,
  denyForLoggedInUsers?: boolean
) {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isEqual(user.loginStatus, LoginStatus.checking)) return;
    if (loginRequired && !user.isLoggedIn) router.push(redirectDomain || `/`);
    if (user.isLoggedIn && denyForLoggedInUsers)
      router.push(redirectDomain || `/`);
    if (isUndefined(user.currentUser)) {
      router.push(redirectDomain || `/`);
      return;
    }
    if (devRequired && !user.currentUser.developer)
      router.push(redirectDomain || `/`);
  }, [user, user.loginStatus]);
}
