export const hasAnyAuthority = (authorities: string[], hasAnyAuthorities: string[]) => {
  console.log("authorities", authorities)
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    return hasAnyAuthorities.some(auth => authorities.includes(auth));
  }
  return false;
};
