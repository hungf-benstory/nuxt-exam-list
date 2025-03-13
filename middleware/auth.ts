// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie('userInfo');  // Retrieve user info from cookies
  const accessToken = useCookie('access_token');  // Retrieve access token from cookies

  // If the user is trying to access /login but is already logged in, redirect to /exam-list
  if ((to.path === '/login' || to.path === '/') && accessToken.value) {
    return navigateTo('/exam-list');
  }

  // If the user is not logged in, redirect to the login page
  if (!accessToken.value) {
    return navigateTo('/login');
  }

  // Optionally, check user-specific data or permissions
  // if (!user.value || !userHasPermission(user.value)) {
  //   return navigateTo('/forbidden');
  // }
});
