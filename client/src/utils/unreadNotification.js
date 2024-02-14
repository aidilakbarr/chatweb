export const unreadnotificationsFunc = (notifications) => {
  return notifications.filter((n) => n.isRead === false);
};
