import React, { useState } from 'react'
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { DiscFull } from "@mui/icons-material";

export function useForm(cFichaAlumno) {
    const [valores, setValores] = useState(cFichaAlumno);

    const handleChange = e => {
        const { name, value } = e.target
        setValores({ ...valores, [name]: value });
        console.log("handleChange=name",name, '  value = ', value )
    };

    return {
        valores,
        setValores,
        handleChange,
    }
}

// MuiFormControl-root
const theme = createTheme(
    {
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: { "& label": { fontSize: "18px", }, },
                },
            }
        },
    }
)
export function Form({ children }) {
    return (
        <form>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </form>
    )
}
