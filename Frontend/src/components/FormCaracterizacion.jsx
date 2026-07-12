import React from "react";

export default function FormCaracterizacion({
    predioActivo,
    subCaracterizacion,
    setSubCaracterizacion,
    inventarioInicial,
    setInventarioInicial,
    guardarInventario,
    // Renombramos directamente aquí usando nombres con mayúscula inicial
    FormSection: FormSection,
    InputField: InputField,
    btnPrincipal,
    gridCheck,
    grid3,
    radioLabel,
}) {

    return (
        <div style={{ maxWidth: "950px", margin: "0 auto" }}>
            {/* 🔴 BLOQUE DE VALIDACIÓN */}
            {!predioActivo ? (
                <FormSection title="⚠️ Selección requerida">
                    <p style={{ color: "#64748b" }}>
                        Debes seleccionar un predio antes de registrar inventario.
                    </p>
                </FormSection>
            ) : (
                <>
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginBottom: "25px",
                        }}
                    >

                        <button onClick={() => setSubCaracterizacion("animal")}
                            style={btnPrincipal}>
                            Existencia Animal
                        </button>

                        <button onClick={() => setSubCaracterizacion("vegetal")}
                            style={btnPrincipal}>
                            Producción Vegetal
                        </button>

                        <button onClick={() => setSubCaracterizacion("maquinaria")}
                            style={btnPrincipal}>
                            Maquinarias
                        </button>
                    </div>


                    {subCaracterizacion === "animal" && (
                        <FormSection title="Existencia Animal">
                            <div style={gridCheck}>
                                {[
                                    "Bovino",
                                    "Bubalino",
                                    "Equino",
                                    "Ovino",
                                    "Porcino",
                                    "Caprino",
                                    "Cunicola",
                                    "Avicola",
                                    "Apicola",
                                ].map((item) => (
                                    <label key={item} style={radioLabel}>
                                        <input
                                            type="checkbox"
                                            checked={inventarioInicial.especiesSeleccionadas.includes(
                                                item,
                                            )}
                                            onChange={() => {
                                                const existe =
                                                    inventarioInicial.especiesSeleccionadas.includes(
                                                        item,
                                                    );

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    especiesSeleccionadas: existe
                                                        ? prev.especiesSeleccionadas.filter(
                                                            (i) => i !== item,
                                                        )
                                                        : [...prev.especiesSeleccionadas, item],
                                                }));
                                            }}
                                        />

                                        {item}
                                    </label>
                                ))}
                            </div>

                        </FormSection>

                    )}



                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Bovino",) && (
                        <FormSection title="Bovinos" >
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.bovinos).map((item) => (
                                    <InputField
                                        key={item}
                                        label={item.replaceAll("_", " ").toUpperCase()}
                                        type="number"
                                        value={inventarioInicial.bovinos[item]}
                                        onChange={(e) => {
                                            setInventarioInicial((prev) => ({
                                                ...prev,
                                                bovinos: {
                                                    ...prev.bovinos,
                                                    [item]: parseInt(e.target.value) || 0,
                                                },
                                            }));
                                        }}
                                    />
                                ))}
                            </div>
                            <p
                                style={{
                                    fontWeight: "700",
                                    color: "#136442",
                                    marginTop: "15px",
                                }}
                            >
                                Total Bovinos:{" "}
                                {Object.values(inventarioInicial.bovinos).reduce(
                                    (a, b) => a + b,
                                    0,
                                )}
                            </p>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Bovino",) && (
                        <FormSection title="Capacidad Productiva Bovina">
                            {/* SISTEMAS PRODUCTIVOS */}
                            <div>
                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginBottom: "15px",
                                        fontSize: "15px",
                                    }}
                                >
                                    Sistemas Productivos
                                </p>

                                <div style={gridCheck}>
                                    {[
                                        "Cría",
                                        "Ceba",
                                        "Doble propósito",
                                        "Lechería",
                                        "Genética",
                                    ].map((item) => (
                                        <label key={item} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={inventarioInicial.capacidadBovina.sistemas.includes(
                                                    item,
                                                )}
                                                onChange={() => {
                                                    const existe =
                                                        inventarioInicial.capacidadBovina.sistemas.includes(
                                                            item,
                                                        );

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,

                                                        capacidadBovina: {
                                                            ...prev.capacidadBovina,

                                                            sistemas: existe
                                                                ? prev.capacidadBovina.sistemas.filter(
                                                                    (s) => s !== item,
                                                                )
                                                                : [
                                                                    ...prev.capacidadBovina.sistemas,
                                                                    item,
                                                                ],
                                                        },
                                                    }));
                                                }}
                                            />

                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* CAMPOS DINÁMICOS */}
                            <div
                                style={{
                                    marginTop: "25px",
                                }}
                            >
                                <div style={grid3}>
                                    {/* LECHE */}
                                    {(inventarioInicial.capacidadBovina.sistemas.includes(
                                        "Lechería",
                                    ) ||
                                        inventarioInicial.capacidadBovina.sistemas.includes(
                                            "Doble propósito",
                                        )) && (
                                            <InputField
                                                label="Producción de leche diaria (L)"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadBovina: {
                                                            ...prev.capacidadBovina,
                                                            leche_diaria: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* CARNE */}
                                    {(inventarioInicial.capacidadBovina.sistemas.includes(
                                        "Ceba",
                                    ) ||
                                        inventarioInicial.capacidadBovina.sistemas.includes(
                                            "Doble propósito",
                                        )) && (
                                            <InputField
                                                label="Producción carne anual (Kg)"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadBovina: {
                                                            ...prev.capacidadBovina,
                                                            carne_anual: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* CRÍA */}
                                    {inventarioInicial.capacidadBovina.sistemas.includes(
                                        "Cría",
                                    ) && (
                                            <InputField
                                                label="Cantidad de partos anuales"
                                                type="number"
                                            />
                                        )}

                                    {/* GENÉTICA */}
                                    {inventarioInicial.capacidadBovina.sistemas.includes(
                                        "Genética",
                                    ) && (
                                            <InputField
                                                label="Cantidad de reproductores"
                                                type="number"
                                            />
                                        )}
                                </div>
                            </div>

                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Bubalino",) && (
                        <FormSection title="Bubalinos">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.bubalinos).map(
                                    (item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            value={inventarioInicial.bubalinos[item]}
                                            onChange={(e) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    bubalinos: {
                                                        ...prev.bubalinos,
                                                        [item]: parseInt(e.target.value) || 0,
                                                    },
                                                }));
                                            }}
                                        />
                                    ),
                                )}
                            </div>

                            <p
                                style={{
                                    fontWeight: "700",
                                    color: "#136442",
                                    marginTop: "15px",
                                }}
                            >
                                Total Bubalinos:{" "}
                                {Object.values(inventarioInicial.bubalinos).reduce(
                                    (a, b) => a + b,
                                    0,
                                )}
                            </p>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Bubalino",) && (
                        <FormSection title="Capacidad Productiva Bubalina">
                            {/* SISTEMAS PRODUCTIVOS */}
                            <div>
                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginBottom: "15px",
                                        fontSize: "15px",
                                    }}
                                >
                                    Sistemas Productivos
                                </p>

                                <div style={gridCheck}>
                                    {[
                                        "Cría",
                                        "Ceba",
                                        "Doble propósito",
                                        "Lechería",
                                        "Genética",
                                    ].map((item) => (
                                        <label key={item} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={inventarioInicial.capacidadBubalina.sistemas.includes(
                                                    item,
                                                )}
                                                onChange={() => {
                                                    const existe =
                                                        inventarioInicial.capacidadBubalina.sistemas.includes(
                                                            item,
                                                        );

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,

                                                        capacidadBubalina: {
                                                            ...prev.capacidadBubalina,

                                                            sistemas: existe
                                                                ? prev.capacidadBubalina.sistemas.filter(
                                                                    (s) => s !== item,
                                                                )
                                                                : [
                                                                    ...prev.capacidadBubalina.sistemas,
                                                                    item,
                                                                ],
                                                        },
                                                    }));
                                                }}
                                            />

                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* CAMPOS DINÁMICOS */}
                            <div
                                style={{
                                    marginTop: "25px",
                                }}
                            >
                                <div style={grid3}>
                                    {/* LECHE */}
                                    {(inventarioInicial.capacidadBubalina.sistemas.includes(
                                        "Lechería",
                                    ) ||
                                        inventarioInicial.capacidadBubalina.sistemas.includes(
                                            "Doble propósito",
                                        )) && (
                                            <InputField
                                                label="Producción de leche diaria (L)"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadBubalina: {
                                                            ...prev.capacidadBubalina,
                                                            leche_diaria: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* CARNE */}
                                    {(inventarioInicial.capacidadBubalina.sistemas.includes(
                                        "Ceba",
                                    ) ||
                                        inventarioInicial.capacidadBubalina.sistemas.includes(
                                            "Doble propósito",
                                        )) && (
                                            <InputField
                                                label="Producción carne anual (Kg)"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadBubalina: {
                                                            ...prev.capacidadBubalina,
                                                            carne_anual: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* CRÍA */}
                                    {inventarioInicial.capacidadBubalina.sistemas.includes(
                                        "Cría",
                                    ) && (
                                            <InputField
                                                label="Cantidad de partos anuales"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadBubalina: {
                                                            ...prev.capacidadBubalina,
                                                            partos_anuales:
                                                                parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* GENÉTICA */}
                                    {inventarioInicial.capacidadBubalina.sistemas.includes(
                                        "Genética",
                                    ) && (
                                            <InputField
                                                label="Cantidad de reproductores"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadBubalina: {
                                                            ...prev.capacidadBubalina,
                                                            reproductores:
                                                                parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}
                                </div>
                            </div>

                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Equino",) && (
                        <FormSection title="Equinos">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.equinos).map((item) => (
                                    <InputField
                                        key={item}
                                        label={item.replaceAll("_", " ").toUpperCase()}
                                        type="number"
                                        value={inventarioInicial.equinos[item]}
                                        onChange={(e) => {
                                            setInventarioInicial((prev) => ({
                                                ...prev,
                                                equinos: {
                                                    ...prev.equinos,
                                                    [item]: parseInt(e.target.value) || 0,
                                                },
                                            }));
                                        }}
                                    />
                                ))}
                            </div>

                            <p
                                style={{
                                    fontWeight: "700",
                                    color: "#136442",
                                    marginTop: "15px",
                                }}
                            >
                                Total Equinos:{" "}
                                {Object.values(inventarioInicial.equinos).reduce(
                                    (a, b) => a + b,
                                    0,
                                )}
                            </p>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Equino",) && (
                        <FormSection title="Capacidad Productiva Equina">
                            {/* SISTEMAS PRODUCTIVOS */}
                            <div>
                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginBottom: "15px",
                                        fontSize: "15px",
                                    }}
                                >
                                    Sistemas Productivos
                                </p>

                                <div style={gridCheck}>
                                    {[
                                        "Trabajo agrícola",
                                        "Transporte",
                                        "Reproducción",
                                        "Deporte",
                                        "Exhibición",
                                        "Turismo",
                                        "Carga",
                                    ].map((item) => (
                                        <label key={item} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={inventarioInicial.capacidadEquina.sistemas.includes(
                                                    item,
                                                )}
                                                onChange={() => {
                                                    const existe =
                                                        inventarioInicial.capacidadEquina.sistemas.includes(
                                                            item,
                                                        );

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,

                                                        capacidadEquina: {
                                                            ...prev.capacidadEquina,

                                                            sistemas: existe
                                                                ? prev.capacidadEquina.sistemas.filter(
                                                                    (s) => s !== item,
                                                                )
                                                                : [
                                                                    ...prev.capacidadEquina.sistemas,
                                                                    item,
                                                                ],
                                                        },
                                                    }));
                                                }}
                                            />

                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* CAMPOS DINÁMICOS */}
                            <div
                                style={{
                                    marginTop: "25px",
                                }}
                            >
                                <div style={grid3}>
                                    {/* TRABAJO */}
                                    {inventarioInicial.capacidadEquina.sistemas.includes(
                                        "Trabajo agrícola",
                                    ) && (
                                            <InputField
                                                label="Cantidad para trabajo agrícola"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadEquina: {
                                                            ...prev.capacidadEquina,
                                                            trabajo_agricola:
                                                                parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* TRANSPORTE */}
                                    {inventarioInicial.capacidadEquina.sistemas.includes(
                                        "Transporte",
                                    ) && (
                                            <InputField
                                                label="Cantidad para transporte"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadEquina: {
                                                            ...prev.capacidadEquina,
                                                            transporte: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* REPRODUCCIÓN */}
                                    {inventarioInicial.capacidadEquina.sistemas.includes(
                                        "Reproducción",
                                    ) && (
                                            <InputField
                                                label="Animales reproductores"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadEquina: {
                                                            ...prev.capacidadEquina,
                                                            reproduccion: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* DEPORTE */}
                                    {inventarioInicial.capacidadEquina.sistemas.includes(
                                        "Deporte",
                                    ) && (
                                            <InputField
                                                label="Equinos para deporte"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadEquina: {
                                                            ...prev.capacidadEquina,
                                                            deporte: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* EXHIBICIÓN */}
                                    {inventarioInicial.capacidadEquina.sistemas.includes(
                                        "Exhibición",
                                    ) && (
                                            <InputField
                                                label="Equinos de exhibición"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadEquina: {
                                                            ...prev.capacidadEquina,
                                                            exhibicion: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* TURISMO */}
                                    {inventarioInicial.capacidadEquina.sistemas.includes(
                                        "Turismo",
                                    ) && (
                                            <InputField
                                                label="Equinos para turismo"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadEquina: {
                                                            ...prev.capacidadEquina,
                                                            turismo: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* CARGA */}
                                    {inventarioInicial.capacidadEquina.sistemas.includes(
                                        "Carga",
                                    ) && (
                                            <InputField
                                                label="Equinos de carga"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadEquina: {
                                                            ...prev.capacidadEquina,
                                                            carga: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}
                                </div>
                            </div>

                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Ovino",) && (
                        <FormSection title="Ovinos">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.ovinos).map((item) => (
                                    <InputField
                                        key={item}
                                        label={item.replaceAll("_", " ").toUpperCase()}
                                        type="number"
                                        value={inventarioInicial.ovinos[item]}
                                        onChange={(e) => {
                                            setInventarioInicial((prev) => ({
                                                ...prev,
                                                ovinos: {
                                                    ...prev.ovinos,
                                                    [item]: parseInt(e.target.value) || 0,
                                                },
                                            }));
                                        }}
                                    />
                                ))}
                            </div>

                            <p
                                style={{
                                    fontWeight: "700",
                                    color: "#136442",
                                    marginTop: "15px",
                                }}
                            >
                                Total Ovinos:{" "}
                                {Object.values(inventarioInicial.ovinos).reduce(
                                    (a, b) => a + b,
                                    0,
                                )}
                            </p>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Ovino",) && (
                        <FormSection title="Capacidad Productiva Ovina">
                            {/* SISTEMAS PRODUCTIVOS */}
                            <div>
                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginBottom: "15px",
                                        fontSize: "15px",
                                    }}
                                >
                                    Sistemas Productivos
                                </p>

                                <div style={gridCheck}>
                                    {[
                                        "Carne",
                                        "Leche",
                                        "Lana",
                                        "Cría",
                                        "Reproducción",
                                        "Doble propósito",
                                        "Genética",
                                    ].map((item) => (
                                        <label key={item} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={inventarioInicial.capacidadOvina.sistemas.includes(
                                                    item,
                                                )}
                                                onChange={() => {
                                                    const existe =
                                                        inventarioInicial.capacidadOvina.sistemas.includes(
                                                            item,
                                                        );

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,

                                                        capacidadOvina: {
                                                            ...prev.capacidadOvina,

                                                            sistemas: existe
                                                                ? prev.capacidadOvina.sistemas.filter(
                                                                    (s) => s !== item,
                                                                )
                                                                : [
                                                                    ...prev.capacidadOvina.sistemas,
                                                                    item,
                                                                ],
                                                        },
                                                    }));
                                                }}
                                            />

                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* CAMPOS DINÁMICOS */}
                            <div
                                style={{
                                    marginTop: "25px",
                                }}
                            >
                                <div style={grid3}>
                                    {/* CARNE */}
                                    {inventarioInicial.capacidadOvina.sistemas.includes(
                                        "Carne",
                                    ) && (
                                            <InputField
                                                label="Producción carne anual (Kg)"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadOvina: {
                                                            ...prev.capacidadOvina,
                                                            carne_anual: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* LECHE */}
                                    {inventarioInicial.capacidadOvina.sistemas.includes(
                                        "Leche",
                                    ) && (
                                            <InputField
                                                label="Producción leche diaria (L)"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadOvina: {
                                                            ...prev.capacidadOvina,
                                                            leche_diaria: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* LANA */}
                                    {inventarioInicial.capacidadOvina.sistemas.includes(
                                        "Lana",
                                    ) && (
                                            <InputField
                                                label="Producción lana anual (Kg)"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadOvina: {
                                                            ...prev.capacidadOvina,
                                                            lana_anual: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* CRÍA */}
                                    {inventarioInicial.capacidadOvina.sistemas.includes(
                                        "Cría",
                                    ) && (
                                            <InputField
                                                label="Animales destinados a cría"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadOvina: {
                                                            ...prev.capacidadOvina,
                                                            cria: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* REPRODUCCIÓN */}
                                    {inventarioInicial.capacidadOvina.sistemas.includes(
                                        "Reproducción",
                                    ) && (
                                            <InputField
                                                label="Reproductores activos"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadOvina: {
                                                            ...prev.capacidadOvina,
                                                            reproduccion: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* DOBLE PROPÓSITO */}
                                    {inventarioInicial.capacidadOvina.sistemas.includes(
                                        "Doble propósito",
                                    ) && (
                                            <InputField
                                                label="Animales doble propósito"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadOvina: {
                                                            ...prev.capacidadOvina,
                                                            doble_proposito:
                                                                parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* GENÉTICA */}
                                    {inventarioInicial.capacidadOvina.sistemas.includes(
                                        "Genética",
                                    ) && (
                                            <InputField
                                                label="Animales de genética"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadOvina: {
                                                            ...prev.capacidadOvina,
                                                            genetica: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}
                                </div>
                            </div>

                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Porcino",) && (
                        <FormSection title="Porcinos">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.porcinos).map((item) => (
                                    <InputField
                                        key={item}
                                        label={item.replaceAll("_", " ").toUpperCase()}
                                        type="number"
                                        value={inventarioInicial.porcinos[item]}
                                        onChange={(e) => {
                                            setInventarioInicial((prev) => ({
                                                ...prev,
                                                porcinos: {
                                                    ...prev.porcinos,
                                                    [item]: parseInt(e.target.value) || 0,
                                                },
                                            }));
                                        }}
                                    />
                                ))}
                            </div>

                            <p
                                style={{
                                    fontWeight: "700",
                                    color: "#136442",
                                    marginTop: "15px",
                                }}
                            >
                                Total Porcinos:{" "}
                                {Object.values(inventarioInicial.porcinos).reduce(
                                    (a, b) => a + b,
                                    0,
                                )}
                            </p>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Porcino",) && (
                        <FormSection title="Capacidad Productiva Porcina">
                            {/* SISTEMAS PRODUCTIVOS */}
                            <div>
                                <p
                                    style={{
                                        fontWeight: "700",
                                        color: "#136442",
                                        marginBottom: "15px",
                                        fontSize: "15px",
                                    }}
                                >
                                    Sistemas Productivos
                                </p>

                                <div style={gridCheck}>
                                    {[
                                        "Cría",
                                        "Engorde",
                                        "Reproducción",
                                        "Ciclo completo",
                                        "Genética",
                                        "Producción de carne",
                                    ].map((item) => (
                                        <label key={item} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={inventarioInicial.capacidadPorcina.sistemas.includes(
                                                    item,
                                                )}
                                                onChange={() => {
                                                    const existe =
                                                        inventarioInicial.capacidadPorcina.sistemas.includes(
                                                            item,
                                                        );

                                                    setInventarioInicial((prev) => ({
                                                        ...prev,

                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,

                                                            sistemas: existe
                                                                ? prev.capacidadPorcina.sistemas.filter(
                                                                    (s) => s !== item,
                                                                )
                                                                : [
                                                                    ...prev.capacidadPorcina.sistemas,
                                                                    item,
                                                                ],
                                                        },
                                                    }));
                                                }}
                                            />

                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* CAMPOS DINÁMICOS */}
                            <div
                                style={{
                                    marginTop: "25px",
                                }}
                            >
                                <div style={grid3}>
                                    {/* CRÍA */}
                                    {inventarioInicial.capacidadPorcina.sistemas.includes(
                                        "Cría",
                                    ) && (
                                            <InputField
                                                label="Cantidad destinada a cría"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            cria: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* ENGORDE */}
                                    {inventarioInicial.capacidadPorcina.sistemas.includes(
                                        "Engorde",
                                    ) && (
                                            <InputField
                                                label="Capacidad de engorde"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            engorde: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* REPRODUCCIÓN */}
                                    {inventarioInicial.capacidadPorcina.sistemas.includes(
                                        "Reproducción",
                                    ) && (
                                            <InputField
                                                label="Reproductores activos"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            reproduccion: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* CICLO COMPLETO */}
                                    {inventarioInicial.capacidadPorcina.sistemas.includes(
                                        "Ciclo completo",
                                    ) && (
                                            <InputField
                                                label="Capacidad ciclo completo"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            ciclo_completo:
                                                                parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* GENÉTICA */}
                                    {inventarioInicial.capacidadPorcina.sistemas.includes(
                                        "Genética",
                                    ) && (
                                            <InputField
                                                label="Animales de genética"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            genetica: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}

                                    {/* PRODUCCIÓN CARNE */}
                                    {inventarioInicial.capacidadPorcina.sistemas.includes(
                                        "Producción de carne",
                                    ) && (
                                            <InputField
                                                label="Producción carne anual (Kg)"
                                                type="number"
                                                onChange={(e) => {
                                                    setInventarioInicial((prev) => ({
                                                        ...prev,
                                                        capacidadPorcina: {
                                                            ...prev.capacidadPorcina,
                                                            carne_anual: parseInt(e.target.value) || 0,
                                                        },
                                                    }));
                                                }}
                                            />
                                        )}
                                </div>
                            </div>

                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Caprino",) && (
                        <FormSection title="Caprinos">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.caprinos).map((item) => (
                                    <InputField
                                        key={item}
                                        label={item.replaceAll("_", " ").toUpperCase()}
                                        type="number"
                                        value={inventarioInicial.caprinos[item]}
                                        onChange={(e) => {
                                            setInventarioInicial((prev) => ({
                                                ...prev,
                                                caprinos: {
                                                    ...prev.caprinos,
                                                    [item]: parseInt(e.target.value) || 0,
                                                },
                                            }));
                                        }}
                                    />
                                ))}
                            </div>

                            <p
                                style={{
                                    fontWeight: "700",
                                    color: "#136442",
                                    marginTop: "15px",
                                }}
                            >
                                Total Caprinos:{" "}
                                {Object.values(inventarioInicial.caprinos).reduce(
                                    (a, b) => a + b,
                                    0,
                                )}
                            </p>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Caprino") && (
                        <FormSection title="Capacidad Productiva Caprina">
                            {/* SISTEMAS PRODUCTIVOS */}
                            <div>
                                <p style={{ fontWeight: "700", color: "#136442", marginBottom: "15px", fontSize: "15px" }}>
                                    Sistemas Productivos Caprinos
                                </p>
                                <div style={gridCheck}>
                                    {[
                                        "Cría y Recría",
                                        "Engorde",
                                        "Producción de Leche",
                                        "Producción de Carne",
                                        "Doble Propósito",
                                        "Genética"
                                    ].map((item) => (
                                        <label key={item} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={inventarioInicial.capacidadCaprino.sistemas.includes(item)}
                                                onChange={() => {
                                                    const existe = inventarioInicial.capacidadCaprino.sistemas.includes(item);
                                                    setInventarioInicial(prev => ({
                                                        ...prev,
                                                        capacidadCaprino: {
                                                            ...prev.capacidadCaprino,
                                                            sistemas: existe
                                                                ? prev.capacidadCaprino.sistemas.filter(s => s !== item)
                                                                : [...prev.capacidadCaprino.sistemas, item]
                                                        }
                                                    }));
                                                }}
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* CAMPOS DINÁMICOS */}
                            <div style={{ marginTop: "25px" }}>
                                <div style={grid3}>
                                    {inventarioInicial.capacidadCaprino.sistemas.includes("Cría y Recría") && (
                                        <InputField
                                            label="Vientres en producción"
                                            type="number"
                                            value={inventarioInicial.capacidadCaprino.vientres || ""}
                                            onChange={(e) => setInventarioInicial(prev => ({
                                                ...prev,
                                                capacidadCaprino: { ...prev.capacidadCaprino, vientres: parseInt(e.target.value) || 0 }
                                            }))}
                                        />
                                    )}
                                    {inventarioInicial.capacidadCaprino.sistemas.includes("Engorde") && (
                                        <InputField
                                            label="Capacidad de engorde (Cabezas)"
                                            type="number"
                                            value={inventarioInicial.capacidadCaprino.engorde || ""}
                                            onChange={(e) => setInventarioInicial(prev => ({
                                                ...prev,
                                                capacidadCaprino: { ...prev.capacidadCaprino, engorde: parseInt(e.target.value) || 0 }
                                            }))}
                                        />
                                    )}
                                    {inventarioInicial.capacidadCaprino.sistemas.includes("Producción de Leche") && (
                                        <InputField
                                            label="Producción diaria promedio (Lts)"
                                            type="number"
                                            value={inventarioInicial.capacidadCaprino.leche_diaria || ""}
                                            onChange={(e) => setInventarioInicial(prev => ({
                                                ...prev,
                                                capacidadCaprino: { ...prev.capacidadCaprino, leche_diaria: parseInt(e.target.value) || 0 }
                                            }))}
                                        />
                                    )}
                                    {(inventarioInicial.capacidadCaprino.sistemas.includes("Producción de Carne") || inventarioInicial.capacidadCaprino.sistemas.includes("Doble Propósito")) && (
                                        <InputField
                                            label="Producción carne estimado anual (Kg)"
                                            type="number"
                                            value={inventarioInicial.capacidadCaprino.carne_anual || ""}
                                            onChange={(e) => setInventarioInicial(prev => ({
                                                ...prev,
                                                capacidadCaprino: { ...prev.capacidadCaprino, carne_anual: parseInt(e.target.value) || 0 }
                                            }))}
                                        />
                                    )}
                                </div>
                            </div>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Cunicola",) && (
                        <FormSection title="Cunícola">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.cunicola).map((item) => (
                                    <InputField
                                        key={item}
                                        label={item.replaceAll("_", " ").toUpperCase()}
                                        type="number"
                                        value={inventarioInicial.cunicola[item]}
                                        onChange={(e) => {
                                            setInventarioInicial((prev) => ({
                                                ...prev,
                                                cunicola: {
                                                    ...prev.cunicola,
                                                    [item]: parseInt(e.target.value) || 0,
                                                },
                                            }));
                                        }}
                                    />
                                ))}
                            </div>

                            <p
                                style={{
                                    fontWeight: "700",
                                    color: "#136442",
                                    marginTop: "15px",
                                }}
                            >
                                Total Cunícola:{" "}
                                {Object.values(inventarioInicial.cunicola).reduce(
                                    (a, b) => a + b,
                                    0,
                                )}
                            </p>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Cunicola") && (
                        <FormSection title="Capacidad Productiva Cunícola">
                            {/* SISTEMAS PRODUCTIVOS */}
                            <div>
                                <p style={{ fontWeight: "700", color: "#136442", marginBottom: "15px", fontSize: "15px" }}>
                                    Sistemas Productivos Cunícolas
                                </p>
                                <div style={gridCheck}>
                                    {[
                                        "Producción de Carne",
                                        "Pie de Cría (Genética)",
                                        "Mascotas / Peletería"
                                    ].map((item) => (
                                        <label key={item} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={inventarioInicial.capacidadCunicola.sistemas.includes(item)}
                                                onChange={() => {
                                                    const existe = inventarioInicial.capacidadCunicola.sistemas.includes(item);
                                                    setInventarioInicial(prev => ({
                                                        ...prev,
                                                        capacidadCunicola: {
                                                            ...prev.capacidadCunicola,
                                                            sistemas: existe
                                                                ? prev.capacidadCunicola.sistemas.filter(s => s !== item)
                                                                : [...prev.capacidadCunicola.sistemas, item]
                                                        }
                                                    }));
                                                }}
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* CAMPOS DINÁMICOS */}
                            <div style={{ marginTop: "25px" }}>
                                <div style={grid3}>
                                    <InputField
                                        label="Número total de jaulas madre"
                                        type="number"
                                        value={inventarioInicial.capacidadCunicola.jaulas_madre || ""}
                                        onChange={(e) => setInventarioInicial(prev => ({
                                            ...prev,
                                            capacidadCunicola: { ...prev.capacidadCunicola, jaulas_madre: parseInt(e.target.value) || 0 }
                                        }))}
                                    />
                                    {inventarioInicial.capacidadCunicola.sistemas.includes("Producción de Carne") && (
                                        <InputField
                                            label="Canales / Carne estimada anual (Kg)"
                                            type="number"
                                            value={inventarioInicial.capacidadCunicola.carne_anual || ""}
                                            onChange={(e) => setInventarioInicial(prev => ({
                                                ...prev,
                                                capacidadCunicola: { ...prev.capacidadCunicola, carne_anual: parseInt(e.target.value) || 0 }
                                            }))}
                                        />
                                    )}
                                    {inventarioInicial.capacidadCunicola.sistemas.includes("Pie de Cría (Genética)") && (
                                        <InputField
                                            label="Conejas reproductoras activas"
                                            type="number"
                                            value={inventarioInicial.capacidadCunicola.reproductoras || ""}
                                            onChange={(e) => setInventarioInicial(prev => ({
                                                ...prev,
                                                capacidadCunicola: { ...prev.capacidadCunicola, reproductoras: parseInt(e.target.value) || 0 }
                                            }))}
                                        />
                                    )}
                                </div>
                            </div>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Avicola",) && (
                        <FormSection title="Avícola">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.avicola).map((item) => (
                                    <InputField
                                        key={item}
                                        label={item.replaceAll("_", " ").toUpperCase()}
                                        type="number"
                                        value={inventarioInicial.avicola[item]}
                                        onChange={(e) => {
                                            setInventarioInicial((prev) => ({
                                                ...prev,
                                                avicola: {
                                                    ...prev.avicola,
                                                    [item]: parseInt(e.target.value) || 0,
                                                },
                                            }));
                                        }}
                                    />
                                ))}
                            </div>

                            <p
                                style={{
                                    fontWeight: "700",
                                    color: "#136442",
                                    marginTop: "15px",
                                }}
                            >
                                Total Avícola:{" "}
                                {Object.values(inventarioInicial.avicola).reduce(
                                    (a, b) => a + b,
                                    0,
                                )}
                            </p>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Avicola") && (
                        <FormSection title="Capacidad Productiva Avícola">
                            {/* SISTEMAS PRODUCTIVOS */}
                            <div>
                                <p style={{ fontWeight: "700", color: "#136442", marginBottom: "15px", fontSize: "15px" }}>
                                    Sistemas Productivos Avícolas
                                </p>
                                <div style={gridCheck}>
                                    {[
                                        "Producción de Huevo (Postura)",
                                        "Pollo de Engorde",
                                        "Recría / Levantes",
                                        "Aves de Traspatio (Doble Propósito)"
                                    ].map((item) => (
                                        <label key={item} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={inventarioInicial.capacidadAvicola.sistemas.includes(item)}
                                                onChange={() => {
                                                    const existe = inventarioInicial.capacidadAvicola.sistemas.includes(item);
                                                    setInventarioInicial(prev => ({
                                                        ...prev,
                                                        capacidadAvicola: {
                                                            ...prev.capacidadAvicola,
                                                            sistemas: existe
                                                                ? prev.capacidadAvicola.sistemas.filter(s => s !== item)
                                                                : [...prev.capacidadAvicola.sistemas, item]
                                                        }
                                                    }));
                                                }}
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* CAMPOS DINÁMICOS */}
                            <div style={{ marginTop: "25px" }}>
                                <div style={grid3}>
                                    {inventarioInicial.capacidadAvicola.sistemas.includes("Producción de Huevo (Postura)") && (
                                        <>
                                            <InputField
                                                label="Capacidad de alojamiento (Avícola)"
                                                type="number"
                                                value={inventarioInicial.capacidadAvicola.capacidad_alojamiento || ""}
                                                onChange={(e) => setInventarioInicial(prev => ({
                                                    ...prev,
                                                    capacidadAvicola: { ...prev.capacidadAvicola, capacidad_alojamiento: parseInt(e.target.value) || 0 }
                                                }))}
                                            />
                                            <InputField
                                                label="Producción diaria (Cartones/Huevos)"
                                                type="number"
                                                value={inventarioInicial.capacidadAvicola.produccion_huevos || ""}
                                                onChange={(e) => setInventarioInicial(prev => ({
                                                    ...prev,
                                                    capacidadAvicola: { ...prev.capacidadAvicola, produccion_huevos: parseInt(e.target.value) || 0 }
                                                }))}
                                            />
                                        </>
                                    )}
                                    {inventarioInicial.capacidadAvicola.sistemas.includes("Pollo de Engorde") && (
                                        <InputField
                                            label="Capacidad por ciclo / lote"
                                            type="number"
                                            value={inventarioInicial.capacidadAvicola.capacidad_lote || ""}
                                            onChange={(e) => setInventarioInicial(prev => ({
                                                ...prev,
                                                capacidadAvicola: { ...prev.capacidadAvicola, capacidad_lote: parseInt(e.target.value) || 0 }
                                            }))}
                                        />
                                    )}
                                </div>
                            </div>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Apicola",) && (
                        <FormSection title="Apícola">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.apicola).map(
                                    (item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            value={inventarioInicial.apicola[item]}
                                            onChange={(e) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    apicola: {
                                                        ...prev.apicola,
                                                        [item]: parseInt(e.target.value) || 0,
                                                    },
                                                }));
                                            }}
                                        />
                                    ),
                                )}
                            </div>

                            <p
                                style={{
                                    fontWeight: "700",
                                    color: "#136442",
                                    marginTop: "15px",
                                }}
                            >
                                Total Colmenas:{" "}
                                {Object.values(inventarioInicial.apicola).reduce(
                                    (a, b) => a + b,
                                    0,
                                )}
                            </p>
                        </FormSection>
                    )}

                    {subCaracterizacion === "animal" && inventarioInicial.especiesSeleccionadas.includes("Apicola") && (
                        <FormSection title="Capacidad Productiva Apícola">
                            {/* SISTEMAS PRODUCTIVOS */}
                            <div>
                                <p style={{ fontWeight: "700", color: "#136442", marginBottom: "15px", fontSize: "15px" }}>
                                    Sistemas Productivos Apícolas
                                </p>
                                <div style={gridCheck}>
                                    {[
                                        "Producción de Miel",
                                        "Producción de Derivados (Polen/Cera)",
                                        "Crianza de Reinas y Núcleos"
                                    ].map((item) => (
                                        <label key={item} style={radioLabel}>
                                            <input
                                                type="checkbox"
                                                checked={inventarioInicial.capacidadApicola.sistemas.includes(item)}
                                                onChange={() => {
                                                    const existe = inventarioInicial.capacidadApicola.sistemas.includes(item);
                                                    setInventarioInicial(prev => ({
                                                        ...prev,
                                                        capacidadApicola: {
                                                            ...prev.capacidadApicola,
                                                            sistemas: existe
                                                                ? prev.capacidadApicola.sistemas.filter(s => s !== item)
                                                                : [...prev.capacidadApicola.sistemas, item]
                                                        }
                                                    }));
                                                }}
                                            />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* CAMPOS DINÁMICOS */}
                            <div style={{ marginTop: "25px" }}>
                                <div style={grid3}>
                                    <InputField
                                        label="Número de colmenas activas"
                                        type="number"
                                        value={inventarioInicial.capacidadApicola.colmenas_activas || ""}
                                        onChange={(e) => setInventarioInicial(prev => ({
                                            ...prev,
                                            capacidadApicola: { ...prev.capacidadApicola, colmenas_activas: parseInt(e.target.value) || 0 }
                                        }))}
                                    />
                                    {inventarioInicial.capacidadApicola.sistemas.includes("Producción de Miel") && (
                                        <InputField
                                            label="Producción estimada anual (Kg/Litros)"
                                            type="number"
                                            value={inventarioInicial.capacidadApicola.miel_anual || ""}
                                            onChange={(e) => setInventarioInicial(prev => ({
                                                ...prev,
                                                capacidadApicola: { ...prev.capacidadApicola, miel_anual: parseInt(e.target.value) || 0 }
                                            }))}
                                        />
                                    )}
                                    {inventarioInicial.capacidadApicola.sistemas.includes("Crianza de Reinas y Núcleos") && (
                                        <InputField
                                            label="Núcleos producidos por año"
                                            type="number"
                                            value={inventarioInicial.capacidadApicola.nucleos_anuales || ""}
                                            onChange={(e) => setInventarioInicial(prev => ({
                                                ...prev,
                                                capacidadApicola: { ...prev.capacidadApicola, nucleos_anuales: parseInt(e.target.value) || 0 }
                                            }))}
                                        />
                                    )}
                                </div>
                            </div>
                        </FormSection>
                    )}


                    {subCaracterizacion === "vegetal" && (
                        <FormSection title="Producción Vegetal">
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "20px" }}>
                                {rubrosVegetales.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "14px",
                                            padding: "20px",
                                            background: "#ffffff",
                                            position: "relative"
                                        }}
                                    >
                                        {/* Encabezado del ítem para dar contexto visual */}
                                        <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "15px" }}>
                                            <span style={{ fontWeight: "600", color: "#475569", fontSize: "14px" }}>
                                                Rubro #{index + 1}
                                            </span>
                                        </div>

                                        {/* Grid estructurado simétricamente */}
                                        <div style={grid3}>
                                            <InputField
                                                label="Rubro"
                                                value={item.rubro}
                                                onChange={(e) => actualizarRubroVegetal(index, "rubro", e.target.value)}
                                            />

                                            <InputField
                                                label="Hectáreas Sembradas"
                                                type="number"
                                                value={item.hectareas}
                                                onChange={(e) => actualizarRubroVegetal(index, "hectareas", e.target.value)}
                                            />

                                            <div>
                                                <label style={labelStyle}>Estado del Cultivo</label>
                                                <select
                                                    style={inputStyle}
                                                    value={item.estado}
                                                    onChange={(e) => actualizarRubroVegetal(index, "estado", e.target.value)}
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="Excelente">Excelente</option>
                                                    <option value="Bueno">Bueno</option>
                                                    <option value="Regular">Regular</option>
                                                    <option value="Malo">Malo</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label style={labelStyle}>Tipo de Riego</label>
                                                <select
                                                    style={inputStyle}
                                                    value={item.riego}
                                                    onChange={(e) => actualizarRubroVegetal(index, "riego", e.target.value)}
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="Secano">Secano</option>
                                                    <option value="Goteo">Goteo</option>
                                                    <option value="Aspersión">Aspersión</option>
                                                    <option value="Inundación">Inundación</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label style={labelStyle}>Ciclo Productivo</label>
                                                <select
                                                    style={inputStyle}
                                                    value={item.ciclo_productivo}
                                                    onChange={(e) => actualizarRubroVegetal(index, "ciclo_productivo", e.target.value)}
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="Corto">Corto</option>
                                                    <option value="Semipermanente">Semipermanente</option>
                                                    <option value="Permanente">Permanente</option>
                                                    <option value="Anual">Anual</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label style={labelStyle}>Tipo de Producción</label>
                                                <select
                                                    style={inputStyle}
                                                    value={item.tipo_produccion}
                                                    onChange={(e) => actualizarRubroVegetal(index, "tipo_produccion", e.target.value)}
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="Tradicional">Tradicional</option>
                                                    <option value="Tecnificada">Tecnificada</option>
                                                    <option value="Orgánica">Orgánica</option>
                                                    <option value="Intensiva">Intensiva</option>
                                                    <option value="Extensiva">Extensiva</option>
                                                </select>
                                            </div>

                                            <InputField
                                                label="Producción Estimada"
                                                type="number"
                                                value={item.produccion_estimada}
                                                onChange={(e) => actualizarRubroVegetal(index, "produccion_estimada", e.target.value)}
                                            />

                                            <div>
                                                <label style={labelStyle}>Destino de Producción</label>
                                                <select
                                                    style={inputStyle}
                                                    value={item.destino}
                                                    onChange={(e) => actualizarRubroVegetal(index, "destino", e.target.value)}
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="Consumo">Consumo</option>
                                                    <option value="Venta">Venta</option>
                                                    <option value="Mixto">Mixto</option>
                                                    <option value="Industrial">Industrial</option>
                                                </select>
                                            </div>

                                            {/* Contenedor del botón eliminar para que se alinee perfectamente en el grid */}
                                            <div style={{ display: "flex", alignItems: "flex-end", height: "100%" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarRubroVegetal(index)}
                                                    style={{
                                                        background: "#dc2626",
                                                        color: "#fff",
                                                        border: "none",
                                                        padding: "10px 16px",
                                                        borderRadius: "10px",
                                                        cursor: "pointer",
                                                        width: "100%",
                                                        height: "42px", // Ajustar a la altura promedio de tus inputs
                                                        fontWeight: "500"
                                                    }}
                                                >
                                                    Eliminar Rubro
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Botón principal de agregar */}
                            <button
                                type="button"
                                onClick={agregarRubroVegetal}
                                style={{
                                    background: "#136442",
                                    color: "#fff",
                                    border: "none",
                                    padding: "12px 20px",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <span>+</span> Agregar Rubro
                            </button>
                        </FormSection>
                    )}


                    {subCaracterizacion === "maquinaria" && (
                        <FormSection title="Maquinarias y Equipos">
                            <div style={gridCheck}>
                                {[
                                    "Maquinaria Agrícola de Ruedas",
                                    "Implementos Agrícolas",
                                    "Equipos de Riego",
                                    "Otros Equipos",
                                ].map((item) => (
                                    <label key={item} style={radioLabel}>
                                        <input
                                            type="checkbox"
                                            checked={inventarioInicial.maquinariaSeleccionada.includes(
                                                item,
                                            )}
                                            onChange={() => {
                                                const existe =
                                                    inventarioInicial.maquinariaSeleccionada.includes(
                                                        item,
                                                    );

                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    maquinariaSeleccionada: existe
                                                        ? prev.maquinariaSeleccionada.filter(
                                                            (i) => i !== item,
                                                        )
                                                        : [...prev.maquinariaSeleccionada, item],
                                                }));
                                            }}
                                        />

                                        {item}
                                    </label>
                                ))}
                            </div>

                        </FormSection>
                    )}


                    {subCaracterizacion === "maquinaria" && inventarioInicial.maquinariaSeleccionada.includes("Maquinaria Agrícola de Ruedas") && (
                        <FormSection title="Maquinaria Agrícola de Ruedas">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.maquinaria_ruedas).map(
                                    (item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            onChange={(e) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    maquinaria_ruedas: {
                                                        ...prev.maquinaria_ruedas,
                                                        [item]: parseInt(e.target.value) || 0,
                                                    },
                                                }));
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        </FormSection>
                    )}

                    {subCaracterizacion === "maquinaria" && inventarioInicial.maquinariaSeleccionada.includes("Implementos Agrícolas") && (
                        <FormSection title="Implemetos Agrícolas">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.implementos).map(
                                    (item) => (
                                        <InputField
                                            key={item}
                                            label={item.replaceAll("_", " ").toUpperCase()}
                                            type="number"
                                            onChange={(e) => {
                                                setInventarioInicial((prev) => ({
                                                    ...prev,
                                                    implementos: {
                                                        ...prev.implementos,
                                                        [item]: parseInt(e.target.value) || 0,
                                                    },
                                                }));
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        </FormSection>
                    )}

                    {subCaracterizacion === "maquinaria" && inventarioInicial.maquinariaSeleccionada.includes("Equipos de Riego") && (
                        <FormSection title="Equipos de Riego">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.riego).map((item) => (
                                    <InputField
                                        key={item}
                                        label={item.replaceAll("_", " ").toUpperCase()}
                                        type="number"
                                        onChange={(e) => {
                                            setInventarioInicial((prev) => ({
                                                ...prev,
                                                riego: {
                                                    ...prev.riego,
                                                    [item]: parseInt(e.target.value) || 0,
                                                },
                                            }));
                                        }}
                                    />
                                ))}
                            </div>
                        </FormSection>
                    )}

                    {subCaracterizacion === "maquinaria" && inventarioInicial.maquinariaSeleccionada.includes("Otros Equipos") && (
                        <FormSection title="Otros Equipos">
                            <div style={grid3}>
                                {Object.keys(inventarioInicial.otros_equipos).map((item) => (
                                    <InputField
                                        key={item}
                                        label={item.replaceAll("_", " ").toUpperCase()}
                                        type="number"
                                        onChange={(e) => {
                                            setInventarioInicial((prev) => ({
                                                ...prev,
                                                otros_equipos: {
                                                    ...prev.otros_equipos,
                                                    [item]: parseInt(e.target.value) || 0,
                                                },
                                            }));
                                        }}
                                    />
                                ))}
                            </div>
                        </FormSection>
                    )}



                    {/* 💾 BOTÓN GUARDAR */}
                    <div style={{ textAlign: "right", paddingBottom: "40px" }}>
                        <button
                            onClick={guardarInventario}
                            style={btnPrincipal}
                        >
                            Guardar Inventario
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// Al final de FormCaracterizacion.jsx (fuera del componente)
const btnPrincipal = {
    backgroundColor: '#059669', // o el color que estés usando
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};

const gridCheck = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px'
};

const grid3 = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px'
};

const radioLabel = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
};