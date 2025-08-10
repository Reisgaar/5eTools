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
});
