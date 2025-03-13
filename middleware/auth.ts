export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie('userInfo');  // Lấy thông tin người dùng từ cookie
  const accessToken = useCookie('access_token');  // Lấy access token từ cookie

  // Nếu người dùng đã đăng nhập và đang cố gắng truy cập /login hoặc /, điều hướng đến /exam-list
  if ((to.path === '/login' || to.path === '/') && accessToken?.value) {
    if (from.path !== '/exam-list') { // Điều kiện dừng redirect
      return navigateTo('/exam-list');
    }
    return; // Ngăn chặn vòng lặp redirect
  }

  // Nếu người dùng chưa đăng nhập và không truy cập /login, điều hướng đến /login
  if (!accessToken.value && to.path !== '/login') {
    return navigateTo('/login');
  }
});
