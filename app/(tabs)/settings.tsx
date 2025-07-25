// REACT
import React from 'react';
import { Alert, Dimensions, FlatList, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// STYLES
import { commonStyles } from 'src/style/styles';

// CONTEXTS
import { useRouter } from 'expo-router';
import { useAppSettings } from 'src/context/AppSettingsContext';
import { useCombat } from 'src/context/CombatContext';

// COMPONENTS
import { Ionicons } from '@expo/vector-icons';
import { classes, races } from 'src/constants/players';
import { addPlayer, loadPlayersList, removePlayer, updatePlayer } from 'src/utils/fileStorage';

const DEFAULT_TOKEN_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSExMWFRUXFRcYGBcXFhUXFhUYFRUXFxUXGBgYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi8lICUtLS0wLS0tLS0tLS0vLS0tLS0tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOAA4AMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAAAgEDBAUHBgj/xAA/EAABAgIHBAcGBAUFAQAAAAABAAIDEQQFEiExQVEGYXGBBxMikaGxwSMyUmLR8EJy4fEUM0OSshUkosLSgv/EABoBAAIDAQEAAAAAAAAAAAAAAAABAgMEBQb/xAAuEQACAQMDAQYGAgMAAAAAAAAAAQIDBBESITFBBTNRYbHwIjJxgaHRkcEjQuH/2gAMAwEAAhEDEQA/AO4oQhAAhCEACEIQAIQkdEAUZzjBZk8AOlLwFS6ISsalUpkNtqI9rG6uIA8Vz6vaMVtBZJqGTMdGSGMV46s+kOhwrml0U/ILv7nSC87SOk6K7+XAY0fM8uPgAskq93PjZfx/0tVI6gYh1SPiEZlcejdIFNdg5jeDB6rFftrTT/XI4Bv0VLp3T5n+WWKidn/id5VT6eQcVxiFtxTR/Wnxa0+ivZt7S59qw4b2y8il3d3Hib/llsaUOp1z/WHAyLQfBXwq6YfeBauV0fpANodbByvLXehHqtpD2oo7xMPsnR13jgpK7vKXzb+/IuVpSn5HT4NJa/3XA8FauawaVPth0tCD6hbChbVRGGTu23uI55rZR7WhLaosflEKnZVRbweT3SFrasruFH913a+E3FbJdSMoyWYvKObOEoPTJYYIQhSIghCEACEIQAIQhAAhCEAChzpKHvksdzprJc3caWy3ZJRyM+JNa2t64g0VluM8NGQxc78rReV5Tavb9sKcKiyiPwMTFjOHxnw4rmFPp74jjFivLnHFzj4bhuXN0VKz1TZfGB7au+kiK+baOzq2/G6ReeWDfFeJp1PfEcYkV5c74nmfngNy0lJrbJg5nDkFglrohm8zWynbqPTBdGL6G1pFaQxgSTuHqsN9bu/CwDiSUsKCBvUOGFyuUIlvdCup0Y6DkmD4vx+SLWE04eApYXgSUEI8xheHT5BIKbFGMu5ZLHyGE1U6RvSwuqG6a6McVifxN7j9VlwKbDdnLcblrw8JTDBOCjKlFgso9DRqQ+EZscQMbsDxGC3tB2hndEbL5hhzC8PCY5vum7TELOotZC5rxZOuX6LDXtMrOM+pso13B+Hoe9hvFzmv3gg+RXpql20dDIZH7TfjGI4jPiuYQ4pYbTTdnoVsIMa2Jgmen3isVOdS3lqg9vfJuq06VzHTNb++DvlFpTIjQ5jg4HAhXLiVQbRRKG8Bt7Te5s7uWhXW6kriHSYYfDM9RmDoV3re5jWW2z8DzV3ZTt5b7rxNkhCFpMYIQhAAhCEACR75JnOksZxmsd3c9zHC5ZKKyLFiAAucQABMk3AAYkrk+2+25j2oFHJbCwc4XGLrwb5o6QtrDHJo8F3smntEf1SP+g8VzunU2xcPfPhvKwUKDk9cuTTGOC6lU1sMAYuyC1UW3EM3YaZJoNGcTaN6zpncugkomynR6sw2w2jKSYQwcD4K57G71WQMAnku04KorCM5feSrHenDyDehzp4JlbwIfNO1s8/vVI0b5q0CWKYIh0LU8ErYMlcCpklklpRX1Y0V8KjtGKkEIe+9ImkluWPddLBYsZk8Va8m4jBVzvkhBJ5Cix3wsO034T6aLb1fShZuMr+YKwGm6Sx3TYbTccxk7cs9agqnHJZTqOl5r3weipJmJj3h4j6qai2ni0OKIjZlv4mTucPQrXUSLbZaB3EZtOhUxmiySL9R6rBDNOXmjbUUa0PJn0Ts9XcOlwmxYZmCMMwcwVtF857G7TuoMa0T7NxFpunzDevoOr6Y2KwPaZgia7lGrrjnqeYuKDpSx06GShCFaZwQhVxnSChUmoRcpcIFuVRHzXgOkjaYw2/wsI9tw9o4H3GnBvF1/LivV7QVs2iwHx3X2RcPicbmjvXBKbTXPc+NEM3OJc47yuFS1V6jqSNdOBhVhSurG84D1Wpo0Ek23GZKZ84ri88hoMgmtWV1ox0rzNMIY3ZlxAclW2LZuSCMU7mgoNOc7os6wH6qpwleFXeDcptlPAnLPIzYk0rM9EOvF0k7Z5nkECIazirGt+8kg5q2G7ckSSRNyHb1JASBrUEgcZ4Ksk6BWWhqldqgiwdNDfFDZKSJoAcjVUPdmnM5XqGs7kA9xIUctMxzGu79VvYMi0OBEiJiWa03VDRZ1UxgxxYbw7Dc7Tn9FnuaWuOVyi+2qOnLfh/jzMenQQ2ThgfA6LoXRNtWWO/hYh7P4D5t5LxkWjh4cL78NBotAyPEhPDgZPY6Y4g+SrtamGRv6GVjx9T64aZqV5rYWvm0ujMeMZCY01C9KusedawCxIrplZEV0gtRWNNEGG+K43MaXHkMFx+1qzSjSXXf9FtKOWcx6Vq6MSO2jNPYhXu3vcPQf5Fc1rePMiGOJ9AtpTaWXudFeZlxLnHeTMrz9GdacXnMq62paIpeHqbFHfBmQpNGCmyHJHuRDatJqz0DqZYFSYZGqa3yQ108SgMImykdPgrgoLQkSaKmKwsUylgoKAwLLRF+qaylc6SBE8TNKeKlrtUxE8kw5EUy0QIe/vUykgMEC65N1p0UItSSHwSXE/eKUuKlpUOboZoEF8k1iYl5JACnawoBHoqLG6xgdO/B35hj33HmtPtDRpEPGdx4jD73LIqV5DnNycJji2ZHgSsqsoJfDc3dMcRgudUj3VbK4Z0of5rdxfK9r9G36H6+MKO6CT2XdoeTh5HvXe2ma+RarrDqIsOL8LgTw/F4TX1Rs9TOtgtdOdy61J/Dg8zcxxLPiZFOOAXhOlGndXRAzOK8Nu0HaPkBzXsKxjydLRcp6VKaHRoUPJjHHm8j/wABcC4fe32Oi/pfsvoQelM55WkSTJDMy+qxoMIgBNWRm9o3T7/2TtbguzDaJfBbsRwTWSZGavLfBIQpZLtJW1u9O0X5eigH7khzUCGaE5kk3pZlIlks5KMckrblNooAcDelLRii2odFCA2IuUNKniluTEWWkTmoab5SUzSGSNJJCxWTUOQDEDVIKgtUWUxFgKsgEYLGtDRMClgakZsI2XBwyM1m0ljmzLYmcxjhiPBa5qy48QWBfi2RBzlcs1xHMcmu3lif1R5SnNIiGes++9fQfQ7WnW0VrSbw0Dm3snyXA60vLTKQlLu/ddO6DabIuhzwf4OE/MFa6Dykce9hiT+p06sYpMR0slx3b+POmPGjWjw/VdXrGJ7R/wCZcc2vfOmRTvH+IXBovN3Ufm/U1RhikvseajXxTuAWTDWMz+Y5ZGC7i4QqYF16ksKkqCUFguG9F6mShzkxAJ5lBmhjlJaDuOqAFkpUNh6XpxdigERJE1Lhoq7CQMss/ZVZJBw9UyaeSAEDkxCdRI6oHghoSvTgBMdUBgoE1YHJZqJ3pi4HkPvFMxomkB5J4QnfNIaLpqx8IOaDK5s/GSRoVlm0JAyE8uSqqfKzRS+dGorii2Wsf8RMuBAK9R0PR7NKeNRDPcXD/svP1/Csw2i1OTvQrZ9FZlS3fkH+YU7V5ijD2isTl9js9avlFfxXJtsWj+Lib7J72hdW2h7Md2+S5btsyVIn8TAe6Y9Fw6fw3lReb9TXGObeL8keUa32jlk2Vju/mcQFkzXdi/hRRDqKjFMSlmmSGAKQsTAqHuGiAYtyGlKXo8UyOSy0paUtqYwS2gUiWS4BVuSOaidyBNklM0EqAnaEAhZcUHgpI3oBkgYTUF6l7dElhAnkct3yVd6YYpgUByI1Wwif3QSkt5IHwZF+KkvIlPVVWjmpINyrqfKy6k/iRi7QRZtaPm9FuOixn+6cflb4v/Recr2KCWgZT9F6/oegExojvmhtHK0T5hWW8cRRg7QnmpL7HXtsYUorXatPh+65ht1CHs4gxm5p5yI8j3rr221GtQg74TNcw2io3WQHgXkdof8Azf8AVcW8j3V7q6PH6Oj2f/ltGuqyv7Od0kyLTyVpKqjzLZJ4JmJrr0n8Jl/2HCLWaHBSxu5WDIaUFpKcCSgumkPAqgOKZTZ5oFgCEuG9OXJUDFcENac0xcoa69MQGaG71JaOaQQz+yALLkzSlagpDG5qtwTAKHXIBiuYm8VXNWByYkICEwOaYtBvzRZG9AYJacllNhdnisZgWTEAaO0TKU5zwWeu9kjTbrdtnm63M4hGgkurdClB7LXS957nd3ZHgFyCK+0ScyfPAL6P6Lar6qGB8DGt5yv8VspLCwcS5nqk34s9xWVHESG5hzBC5BSGFji0/hJBXaSua7d0Dq4vWAdl/muf2rQ101Ncx9GdDsS40VnTfEvVHIazgdXEc2V05jgcFg0fGz3L0+0NHDm2x7zcd4P09V5gjMYhQtKuYrJsu6Pd1Gl9voZFm/FBCUPnfNOCtxn2ZCiSJKZoEBQoLZBQ1yAJUiaie5SDcgBXMUBqd7gqwRPemJ4JaU00oaNVMkgQ09EXoA3KLO9AybOqmSQOkpa8oDJBKUuTzCVx0vTEwBUh80slYAkCLqPdl+6wq2jWWEE9pxlLQZrNLgAL5rzVZUvrHl2WA+qpgtc89CyvPuqWnqzabIVf1tJZoztnl7vjLuX1BsrQ+rgN1N6430S7PkgPIviEOO5g90eJPNd7hskABkt8VhHCm8sZanaWrBHgubnK7itsgoaTWGRjJxaa5R880+M5rnQ3tkRMFeUpTC0ybhkuwdJ2zpH+4hj8w3a8lymkvDhIXjy4Ljdy6E2uh6iNwrukpdV6mvhOIxwOmRWTNYj3kdkDiroMW69bYSytzG1guBUqGlMR+ymMrdfmhFhRaQIgmSGlM1s8lIuQLAhaT9zQUxM1BQBDXnSaYHclLwpGH0QMa0hyrc05X+CACgMk2UBoTXjJRegQxloozxSyTNQMeSSIZmwOZKSkxJCTRfrosamRAGAOGHeVCW+yJppbsSsIvVtsNdedMgqdnKo/iYwZ+EXvPy6c8FrgC50gCS4gAak4ALtvRnsjYABF9zoh1OQ4BaKcMHKuK2t5OgbE1V1UO2RImUtwXqEkJgaABgE6tMgIQhAFNLo4iNLXYFcH252XdQ4hewezcf7f0Xflr65qplIhljwDMKurTVSOGX29eVGepfc+ZIpuvx1WM49y9HtrsjFojzIkwp3fLuO7evKOAzOCwd24PDO0qsai1LgyoDp4d2Y/RWgrDYZdqfAjJZTIwONx1yPEZK5TzyR0tFslWRzTSP3ogqYhbKg8U9lKTuQBAUm8IBTBAFJYpNyZzFBhII4JUk71DWKer5IHuMzggtzQFER4aJk3IJEE6pIrXS7InPNY8SkF3ua4ZlXUmnuhtDiRM/hzUJN8IFpxmXAjaSYc3YAYg4laam0sxXWjcBgNFNKpLnm048hgF7PYjYxz3tixGzNxYwjD5nfRW06eN+pguLhy2XBl9Hmyby4RHjtu9wS9wHM7z4L6AqWrWwIYaMcysPZyo2wGzN7jiVvFoMDeQQhCBAhCEACEIQBr63qplIYWuAwXB9tej6JR3F8IEsxsafl1G5fRCopdEbEbZcJhRlFS5LKdSUHlHyJDi2fomEUHC7cu1badGrYk4kO52oF/MZrj1d1LGop9ow2fiF7eenNZpUsHQp3Sf6FgvIuaOIOHcsxpBC0UGmuaZi8LOZWzTi2X3qq2prg1QqU5c7Gw7kELWtih5mLycNyymNOE8k9eOSenPBkWUrMcEjnEZzUQ4zjcACnrQtDLnhMAqobyfwXagiSqfFcDI3Z5I1oelrcyXOSucBmsbrptnK/NQ+OxrbyDuRqfRCeOrLusLh2PFYcaGZ9u465FYwrNzbgJjfgsOlUl7/ePLIKShJvczzuIJbbszv43q3SYBMfi+8VhWYkZ8hN73HAXkrc1JstHpBDiOqZq4do8G/Vdb2P2CDR2W2QcXm9zuaujTwYatdy5PJbGbCm2HvFuJkMWs+p3rt+z9QtgNmb3HErMqyq2QGyaOaz1aZm8ghCECBCEIAEIQgAQhCABCEIAghaitdnoUcGYkdVuEIA4xtN0UNM3QxZOrBdzbh3SXOK02HpUEmQESWlx7j9V9WkLEpdWQonvNBUXFFiqSR8eUiC9hk9rmO0cC08poZSHDBx819R1hsTCiCQw0IBHivK1j0VQnT9kw8BZPgouBYq7Rw5lZvGh5JoFauAwae9dPpXRG3JjxwcT5zWEeiqWcb/h/wCVF0Y+BYrufiznf+qvkRcBpesd9NdPFdLb0V3z9sf7fRqz6P0VNzhPPFx9E1SS6ClcyfVnIDGd8RlmJq6h0KJFPs4bncBdzOAXeKu6MmtwhQ28WzPivTULYlg9509wCnpKXVbODVbsNHiStuDBoBad9Aug7NdHLWkObDv+N955ZDkurUKpIMP3WjitiGyTSRBybPP1TstDhXu7RW/YwC4JkJkQQhCABCEIAEIQgD//2Q==";

export default function SettingsScreen() {
    const { themeName, currentTheme, setTheme } = useAppSettings();
    const { syncPlayerCombatants } = useCombat();
    const router = useRouter();

    // Player management state
    const [players, setPlayers] = React.useState<any[]>([]);
    const [playerModalVisible, setPlayerModalVisible] = React.useState(false);
    const [editPlayer, setEditPlayer] = React.useState<any | null>(null);
    const [form, setForm] = React.useState({ name: '', race: '', class: '', maxHp: '', ac: '', tokenUrl: '' });

    // Load players on mount
    React.useEffect(() => {
        (async () => {
            const list = await loadPlayersList();
            setPlayers(list);
        })();
    }, []);

    // Add or update player
    const handleSavePlayer = async () => {
        if (!form.name.trim()) {
            Alert.alert('Name is required');
            return;
        }
        const playerData = {
            name: form.name,
            race: form.race,
            class: form.class,
            maxHp: parseInt(form.maxHp) || 0,
            ac: parseInt(form.ac) || 0,
            tokenUrl: form.tokenUrl?.trim() || DEFAULT_TOKEN_URL,
        };
        if (editPlayer) {
            await updatePlayer(editPlayer.name, playerData);
            syncPlayerCombatants(playerData);
        } else {
            await addPlayer(playerData);
        }
        const list = await loadPlayersList();
        setPlayers(list);
        setPlayerModalVisible(false);
        setEditPlayer(null);
        setForm({ name: '', race: '', class: '', maxHp: '', ac: '', tokenUrl: '' });
    };

    // Delete player
    const handleDeletePlayer = async (name: string) => {
        Alert.alert('Delete Player', `Remove ${name}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                await removePlayer(name);
                const list = await loadPlayersList();
                setPlayers(list);
            }}
        ]);
    };

    // Open modal for add/edit
    const openAddModal = () => {
        setEditPlayer(null);
        setForm({ name: '', race: '', class: '', maxHp: '', ac: '', tokenUrl: '' });
        setPlayerModalVisible(true);
    };
    const openEditModal = (player: any) => {
        setEditPlayer(player);
        setForm({
            name: player.name,
            race: player.race,
            class: player.class,
            maxHp: player.maxHp?.toString() || '',
            ac: player.ac?.toString() || '',
            tokenUrl: player.tokenUrl || '',
        });
        setPlayerModalVisible(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <View style={{ marginBottom: 16, borderBottomWidth: 1, paddingHorizontal: 16, paddingVertical: 8, borderBottomColor: currentTheme.primary }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: currentTheme.text }}>Settings</Text>
            </View>
            <View style={[commonStyles.container, { backgroundColor: currentTheme.background, paddingTop: 0 }]}> 
                <View style={{ justifyContent: 'center', marginBottom: 12 }}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Theme</Text>
                    <View style={commonStyles.row}>
                        <Pressable
                            onPress={() => setTheme('light')}
                            style={[
                                commonStyles.langButton,
                                themeName === 'light' && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text }}>Light</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setTheme('dark')}
                            style={[
                                commonStyles.langButton,
                                themeName === 'dark' && [commonStyles.selected, { borderColor: currentTheme.buttonBackground }],
                            ]}
                        >
                            <Text style={{ color: currentTheme.text }}>Dark</Text>
                        </Pressable>
                    </View>
                </View>
                {/* Player Character Management Section */}
                <View style={{ flex: 1, marginTop: 32 }}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Players Characters</Text>
                    <View style={{ flex: 1, borderWidth: 1, borderColor: currentTheme.primary, borderRadius: 8, overflow: 'hidden' }}>
                        <FlatList
                            data={players}
                            keyExtractor={item => item.name}
                            renderItem={({ item, index }) => (
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between', 
                                        paddingVertical: 8, 
                                        paddingHorizontal: 16, 
                                        borderBottomWidth: index === players.length - 1 ? 0 : 1, 
                                        borderBottomColor: currentTheme.primary,
                                        backgroundColor: currentTheme.card
                                    }}
                                >
                                    <View>
                                        <Text style={{ color: currentTheme.text, fontWeight: 'bold' }}>{item.name}</Text>
                                        <Text style={{ color: currentTheme.text }}>{item.race} - {item.class}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Pressable onPress={() => openEditModal(item)} style={{ marginRight: 12 }}>
                                            <Ionicons name="pencil" size={20} color={currentTheme.primary} />
                                        </Pressable>
                                        <Pressable onPress={() => handleDeletePlayer(item.name)}>
                                            <Ionicons name="trash" size={20} color="#c00" />
                                        </Pressable>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={<Text style={{ color: currentTheme.noticeText, textAlign: 'center', marginVertical: 12 }}>No players created.</Text>}
                        />
                    </View>
                    <Pressable onPress={openAddModal} style={[commonStyles.button, { backgroundColor: currentTheme.primary, marginTop: 12 }]}> 
                        <Text style={[commonStyles.buttonText, { color: currentTheme.buttonText || 'white' }]}>Add Player</Text>
                    </Pressable>
                </View>
                {/* Add/Edit Player Modal */}
                <Modal visible={playerModalVisible} animationType="slide" transparent>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: currentTheme.card, borderRadius: 12, padding: 24, marginBottom: 100, width: 320, maxWidth: '90%', maxHeight: Dimensions.get('window').height * 0.5 }}>
                            <Text style={[styles.sectionTitle, { color: currentTheme.text, marginBottom: 8 }]}>{editPlayer ? 'Edit Player' : 'Add Player'}</Text>
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                                <TextInput
                                    style={[commonStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text }]}
                                    placeholder="Name"
                                    placeholderTextColor={currentTheme.noticeText}
                                    value={form.name}
                                    onChangeText={t => setForm(f => ({ ...f, name: t }))}
                                />
                                <TextInput
                                    style={[commonStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text }]}
                                    placeholder="Race"
                                    placeholderTextColor={currentTheme.noticeText}
                                    value={form.race}
                                    onChangeText={t => setForm(f => ({ ...f, race: t }))}
                                    autoCorrect={false}
                                    autoCapitalize="words"
                                />
                                <TextInput
                                    style={[commonStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text }]}
                                    placeholder="Class"
                                    placeholderTextColor={currentTheme.noticeText}
                                    value={form.class}
                                    onChangeText={t => setForm(f => ({ ...f, class: t }))}
                                    autoCorrect={false}
                                    autoCapitalize="words"
                                />
                                <TextInput
                                    style={[commonStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text }]}
                                    placeholder="Max HP"
                                    placeholderTextColor={currentTheme.noticeText}
                                    keyboardType="numeric"
                                    value={form.maxHp}
                                    onChangeText={t => setForm(f => ({ ...f, maxHp: t }))}
                                />
                                <TextInput
                                    style={[commonStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text }]}
                                    placeholder="AC"
                                    placeholderTextColor={currentTheme.noticeText}
                                    keyboardType="numeric"
                                    value={form.ac}
                                    onChangeText={t => setForm(f => ({ ...f, ac: t }))}
                                />
                                <TextInput
                                    style={[commonStyles.input, { backgroundColor: currentTheme.innerBackground, color: currentTheme.text }]}
                                    placeholder="Token URL (optional)"
                                    placeholderTextColor={currentTheme.noticeText}
                                    value={form.tokenUrl}
                                    onChangeText={t => setForm(f => ({ ...f, tokenUrl: t }))}
                                />
                            </ScrollView>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                                <Pressable onPress={() => { setPlayerModalVisible(false); setEditPlayer(null); }} style={[commonStyles.button, { backgroundColor: '#eee', flex: 1, marginRight: 8 }]}> 
                                    <Text style={[commonStyles.buttonText, { color: 'black' }]}>Cancel</Text>
                                </Pressable>
                                <Pressable onPress={handleSavePlayer} style={[commonStyles.button, { backgroundColor: currentTheme.primary, flex: 1, marginLeft: 8 }]}> 
                                    <Text style={[commonStyles.buttonText, { color: currentTheme.buttonText || 'white' }]}>{editPlayer ? 'Save' : 'Add'}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
});
