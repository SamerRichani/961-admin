export function calculateAge(birthdate: string): number {
  const today = new Date();
  const birthdateDate = new Date(birthdate);
  let age = today.getFullYear() - birthdateDate.getFullYear();
  const monthDiff = today.getMonth() - birthdateDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthdateDate.getDate())
  ) {
    age--;
  }

  return age;
}
