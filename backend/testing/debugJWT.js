export function debugJWT() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('❌ No hay token en localStorage');
    return;
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('🔍 Token Debug:');
    console.log('   User:', payload.nombre);
    console.log('   Exp:', new Date(payload.exp * 1000));
    console.log('   Iat:', new Date(payload.iat * 1000));
  } catch (err) {
    console.error('❌ Error decoding token:', err);
  }
}