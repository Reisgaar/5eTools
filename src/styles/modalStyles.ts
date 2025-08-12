import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
    // Modal overlay - fondo oscuro
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // Contenido principal del modal
    modalContent: {
        borderRadius: 12,
        padding: 0,
        marginHorizontal: 20,
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    
    // Header del modal con título y botón de cerrar
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    
    // Título del modal
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    
    // Botón de cerrar (X)
    closeButton: {
        padding: 4,
    },
    
    // Línea separadora después del header
    separator: {
        height: 1,
        marginBottom: 0,
    },
    
    // Contenedor del contenido del modal
    modalBody: {
        padding: 20,
    },
    
    // Etiquetas de campos
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    
    // Campos de entrada
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    
    // Contenedor de botones
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    
    // Botón del modal
    modalButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    // Botón secundario del modal
    modalButtonSecondary: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    
    // Botón de peligro del modal
    modalButtonDanger: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc2626',
    },
    
    // Texto del botón
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    
    // Estado vacío
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    
    // Texto de estado vacío
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    
    // Contenedor de valor para modales de edición
    valueContainer: {
        marginBottom: 24,
        width: '100%',
    },
    
    // Input de valor para modales de edición
    valueInput: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
    // Contenedor de botones para modales de edición
    editButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
        gap: 16,
    },
    
    // Columna de botones
    buttonColumn: {
        flex: 1,
        gap: 8,
    },
    
    // Contenedor de botón de roll
    rollButtonContainer: {
        marginBottom: 16,
        width: '100%',
    },
    
    // Contenedor de nombre de criatura
    creatureNameContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    
    // Contenedor de display de HP
    hpDisplayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 12,
    },
    
    // Input de HP actual
    currentHpInput: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: 80,
    },
    
    // Separador de HP
    hpSeparator: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    
    // Display de HP máximo
    maxHpDisplay: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    // Texto de HP máximo
    maxHpText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    
    // Contenedor de HP máximo
    maxHpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        gap: 12,
    },
    
    // Input de HP máximo
    maxHpInput: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: 80,
    },
});
