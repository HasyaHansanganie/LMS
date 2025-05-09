import { React, useEffect, useState } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import axios from "axios";

const Header = ({ filePath, pageName, userEmail }) => {

    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/auth/get_notifications/${userEmail}`);
                console.log(res.data);
                setNotifications(res.data);
            } catch (error) {
                console.error("Failed to load notifications", error);
            }
        };

        fetchNotifications();
    }, []);
    
    const markAsRead = async (id) => {
        try {
            const res = await axios.post(`http://localhost:5000/auth/mark_as_read/${id}`);
            setNotifications(prev =>
                prev.map(n =>
                    n.id === id ? { ...n, isRead: 1 } : n
                )
            );
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };
    

    return (
        <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="d-flex align-items-center gap-3 text-secondary">
                <FaBars role="button" size={18} />
                <span style={{ fontSize: "0.8rem" }}>{filePath} <span className="fw-semibold">{pageName}</span></span>
            </div>

            <div className="position-relative">
                <FaBell
                    role="button"
                    size={18}
                    onClick={() => setShowDropdown(!showDropdown)}
                />
                {notifications.some(n => !n.isRead) && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                        {notifications.filter(n => !n.isRead).length}
                        <span className="visually-hidden">unread messages</span>
                    </span>
                )}

                {showDropdown && (
                    <div className="position-absolute end-0 mt-2 bg-white shadow border rounded-3 p-2" style={{ width: "300px", zIndex: 999 }}>
                        <ul className="list-group list-group-flush">
                            {notifications.length === 0 ? (
                                <li className="list-group-item small text-center text-muted">No notifications</li>
                            ) : (
                                notifications.map((note, index) => (
                                    <li
                                        key={index}
                                        className={`list-group-item small d-flex justify-content-between align-items-start ${!note.isRead ? 'fw-bold' : ''}`}
                                        onClick={() => markAsRead(note.id)}
                                        role="button"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            {note.message}
                                            <br />
                                            <span className="text-muted small">
                                                {new Date(note.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}

            </div>
        </div>

    );
};

export default Header;