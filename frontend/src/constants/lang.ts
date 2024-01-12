const lang = {
    validation: {
        nameRequired: (fieldName: string) => `Pole ${fieldName} jest wymagane`,
        min: (min: number, fieldName: string) => `Pole ${fieldName} wymaga minimum znaków: ${min}`,
        max: (max: number, fieldName: string) => `Pole ${fieldName} wymaga maksymalnie znaków: ${max}`,
        password: 'Pole Hasło musi mieć przynajmniej 8 znaków i zawierać przynajmniej 1 wielką literę, 1 symbol i 1 cyfrę.',
        repeatPassword: 'Hasła muszą być takie same',
        email: 'Pole email nie jest poprawnym emailem'
    },
    categories: {
        titles: {
            deleting: 'Usuwanie kategorii',
            add: 'Dodawanie kategorii',
            edit: 'Edytowanie kategorii'
        },
        error: {
            details: {
                deleting: 'Nie udało się usunąć categorii',
                add: 'Nie udało się dodać kategorii',
                editFetch: 'Nie udało się pobrać kategorii',
                exists: 'Kategoria z taką nazwą już istnieje!',
                edit: 'Nie udało się edytować kategorii'
            }
        },
        success: {
            details: {
                deleting: 'Pomyślnie usunięto kategorie',
                add: 'Pomyślnie dodano nową kategorie',
                edit: 'Pomyślnie edytowano kategorie'
            }
        },
    },
    auth: {
        titles: {
            register: 'Tworzenie konta',
            login: 'Logowanie'
        },
        error: {
            details: {
                exists: 'Taki użytkownik już istnieje!',
                register: 'Nie udało się stworzyć konta',
                login: 'Nie udało się zalogować'
            }
        },
        success: {
            details: {
                register: 'Pomyślnie utworzono konto'
            }
        }
    },
    user: {
        titles: {
            updateData: 'Edycja danych',
            updatePassword: 'Zmiana hasła'
        },
        error: {
            details: {
                updateData: 'Nie udało się edytować danych',
                updatePassword: 'Nie udało się zaktualizować hasła'
            }
        },
        success: {
            details: {
                updateData: 'Pomyślnie edytowano dane',
                updatePassword: 'Pomyślnie zaktualizowano hasło'
            }
        }
    },
    entries: {
        titles: {
            add: 'Dodawanie wpisu',
            edit: 'Edycja wpisu',
            deleting: 'Usuwanie wpisu'
        },
        error: {
            details: {
                add: 'Nie udało się dodać wpisu',
                edit: 'Nie udało się edytować wpisu',
                deleting: 'Nie udało się usunąć wpisu',
                editFetch: 'Nie udało się pobrać wpisu'
            }
        },
        success: {
            details: {
                add: 'Pomyślnie dodano nowy wpis',
                edit: 'Pomyślnie edytowano wpis',
                deleting: 'Pomyślnie usunięto wpis'
            }
        }
    }
} as const;

export {
    lang
}