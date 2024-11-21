import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    currentEmail: {
        fontSize: 16,
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    timeInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        width: 80,
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    controlItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingVertical: 5,
    },
    backButton: {
        backgroundColor: '#4CAF50',
        marginTop: 20,
    },
});

export default styles;