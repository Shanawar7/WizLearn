const Modal = ({ title, children, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2 className="modal-title">{title}</h2>
                <button className="btn-close" onClick={onClose}>×</button>
            </div>
            {children}
        </div>
    </div>
);
