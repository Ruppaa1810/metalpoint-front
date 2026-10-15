import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{orange.50}',
            100: '{orange.100}',
            200: '{orange.200}',
            300: '{orange.300}',
            400: '{orange.400}',
            500: '{orange.500}',
            600: '{orange.600}',
            700: '{orange.700}',
            800: '{orange.800}',
            900: '{orange.900}',
            950: '{orange.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '{zinc.200}',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                }
            },
            dark: {
                surface: {
                    0: '#09090b', // Ajustado a tono oscuro profundo
                    50: '{violet.950}',
                    100: '{violet.900}',
                    200: '{violet.800}',
                    300: '{violet.700}',
                    400: '{violet.600}',
                    500: '{violet.500}',
                    600: '{violet.400}',
                    700: '{violet.300}',
                    800: '{violet.200}',
                    900: '{violet.100}',
                    950: '{violet.50}'
                }
            }
        }
    }
});

export default MyPreset;