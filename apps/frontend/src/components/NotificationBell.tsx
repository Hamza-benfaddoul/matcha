// components/NotificationBell.tsx
import { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { Badge, Popover, List, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
    if (newVisible && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <Popover
      placement="bottomRight"
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Notifications</span>
          <Button type="link" size="small" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
      }
      content={
        <List
          itemLayout="horizontal"
          dataSource={notifications.slice(0, 5)}
          renderItem={(item) => (
            <List.Item 
              style={{ 
                padding: '8px 12px',
                background: item.read ? '#fff' : '#f6ffed'
              }}
            >
              <List.Item.Meta
                title={item.type}
                description={item.message}
              />
            </List.Item>
          )}
        />
      }
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <Badge count={unreadCount} overflowCount={9}>
        <BellOutlined style={{ fontSize: 20 }} />
      </Badge>
    </Popover>
  );
};

export default NotificationBell;