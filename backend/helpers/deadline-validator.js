function confirmDeadline(deadline) {
    const now = new Date(Date.now());
    
    const endedYear = deadline.getFullYear();
    const nowYear = now.getFullYear();
    if(endedYear > nowYear) return true;
    if(endedYear < nowYear) return false;

    const endedMonth = deadline.getMonth();
    const nowMonth = now.getMonth();
    if(endedMonth > nowMonth) return true;
    if(endedMonth < nowMonth) return false;
    
    const endedDay = deadline.getDate();
    const nowDay = now.getDate();
    if(endedDay > nowDay) return true;
    
    return false;
}
const confirmdeadlineValidator = [ confirmDeadline, 'deadline must be a future date' ];

export default confirmdeadlineValidator;