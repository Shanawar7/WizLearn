// Utility functions for generating unique IDs

/**
 * Generates a unique User ID
 * Format: WL-USER-XXXXX (5 digits based on timestamp)
 * Example: WL-USER-74852
 */
export const generateUserId = () => {
    const timestamp = Date.now();
    const uniqueNum = timestamp.toString().slice(-5);
    return `WL-USER-${uniqueNum}`;
};

/**
 * Generates a unique Course ID
 * Format: WL-COURSE-XXXXXXXX (8 random alphanumeric characters)
 * Example: WL-COURSE-A7F9E2B1
 */
export const generateCourseId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomStr = '';
    for (let i = 0; i < 8; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `WL-COURSE-${randomStr}`;
};

/**
 * Gets a course color based on index (for consistent, alternating pattern)
 * Uses only WizLearn's 2 theme colors for brand consistency
 * @param {number} index - The position of the course (0, 1, 2, 3...)
 */
export const getCourseColorByIndex = (index) => {
    const themeColors = [
        { from: '#1D2A50', to: '#2a3f6e' },     // Primary: Deep Blue
        { from: '#F0D459', to: '#e8c850' },     // Secondary: Yellow/Gold
    ];

    const safeIndex = (typeof index === 'number' && !isNaN(index)) ? index : 0;
    return themeColors[safeIndex % themeColors.length];
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('wizlearn_user');
    return userStr ? JSON.parse(userStr) : null;
};

/**
 * Save user to localStorage
 */
export const saveUser = (user) => {
    localStorage.setItem('wizlearn_user', JSON.stringify(user));
};

/**
 * Clear user from localStorage (logout)
 */
export const clearUser = () => {
    localStorage.removeItem('wizlearn_user');
};
