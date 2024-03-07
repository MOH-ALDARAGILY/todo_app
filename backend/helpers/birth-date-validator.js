function confirmBirthDate(birthDate) {
    const now = new Date(Date.now());
    return now.getFullYear() - birthDate.getFullYear() > 5;
}
const confirmBirthDateValidator = [ confirmBirthDate, 'User Must Be Older Than 6 Years Old.' ];
export default confirmBirthDateValidator;