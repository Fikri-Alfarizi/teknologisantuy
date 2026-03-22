export default function Loading() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'var(--blue-dark, #0d3f5e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .dot {
            width: 14px;
            height: 14px;
            background-color: var(--yellow, #ffe135);
            border-radius: 50%;
            display: inline-block;
            animation: dot-bounce 1.4s infinite ease-in-out both;
          }
          .dot1 { animation-delay: -0.32s; }
          .dot2 { animation-delay: -0.16s; }
          @keyframes dot-bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1.0); }
          }
        `}} />
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}
