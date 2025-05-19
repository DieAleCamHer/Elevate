'use client';

export default function MiembroModal({ titulo, children, onCerrar }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3 style={{ color: 'purple', marginBottom: '15px' }}>{titulo}</h3>
        {children}
        <button onClick={onCerrar} style={{ marginTop: '20px' }}>Cancelar</button>
      </div>

      <style jsx>{`
  .modal {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background-color: white;
    padding: 25px 20px;
    border-radius: 10px;
    width: 100%;
    max-width: 400px; /* ✅ más compacto */
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }

  h3 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 20px;
  }

  button {
    width: 100%;
    padding: 10px;
    border: none;
    margin-top: 10px;
    border-radius: 6px;
    background-color: #17a2b8;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }

  button:hover {
    background-color: #138496;
  }
`}</style>

    </div>
  );
}
