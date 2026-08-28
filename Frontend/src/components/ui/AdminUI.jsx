import React from 'react';

// Estilos globales reutilizables
export const estiloInput = {
    width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #136442",
    fontSize: "14px", marginTop: "5px", outline: "none"
};

export const estiloBoton = {
    padding: "10px 18px", color: "#fff", border: "none", borderRadius: "8px",
    cursor: "pointer", fontWeight: "bold", fontSize: "11px"
};

export const labelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "8px" };
export const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", backgroundColor: "#f8fafc" };

export const avatarWrapper = { width: "45px", height: "45px", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)" };

export const chartCard = {
    background: "#fff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0"
};

export const chartTitle = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#136442",
    marginBottom: "15px"
};

export const chartPlaceholder = {
    height: "200px",
    background: "#f1f5f9",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    border: "2px dashed #cbd5e1"
};

// Componentes UI pequeños
export const InputField = ({ label, error, prefix, ...props }) => (
    <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>{label}</label>
        <div
            style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "all 0.2s ease",
                border: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                backgroundColor: error ? "#fef2f2" : "#f8fafc"
            }}
            className="focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500"
        >
            {prefix && (
                <div style={{
                    height: "42px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: error ? "#fee2e2" : "#f1f5f9",
                    borderRight: error ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                }}>
                    {prefix}
                </div>
            )}
            <input
                {...props}
                style={{
                    ...inputStyle,
                    border: "none",
                    backgroundColor: "transparent",
                    width: "100%",
                    height: "42px",
                    outline: "none",
                    boxShadow: "none",
                    margin: 0
                }}
            />
        </div>
        {error && (
            <p style={{
                color: "#ef4444",
                fontSize: "11px",
                marginTop: "5px",
                fontWeight: "600",
                animation: "fadeIn 0.3s ease"
            }}>
                {error}
            </p>
        )}
    </div>
);

export const Spinner = ({ color = "#136442" }) => {
    const spinnerRef = (el) => {
        if (el) {
            el.animate(
                [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
                { duration: 1000, iterations: Infinity }
            );
        }
    };

    return (
        <svg
            ref={spinnerRef}
            width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
};

export const CardStat = ({ label, value, color }) => (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "20px", borderTop: `4px solid ${color}`, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px", fontWeight: "500" }}>{label}</p>
        <h3 style={{ margin: "10px 0 0", fontSize: "28px", color: "#1e293b", fontWeight: "700" }}>{value}</h3>
    </div>
);

