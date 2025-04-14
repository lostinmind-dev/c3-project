type KeyState = 'up' | 'down' | 'pressed';
export type KeyCombo = [string, string];

export class Keyboard {
    readonly keys = new Map<string, KeyState>();
    previousKeys = new Map<string, KeyState>();

    readonly combos = new Set<KeyCombo>();
    private previousCombos = new Set<KeyCombo>();

    onKeyDown(e: KeyboardEvent) {
        const previousState = this.keys.get(e.code);

        if (previousState !== 'down') {
            this.keys.set(e.code, 'down');
            return e.code;
        }
    }

    onKeyUp(e: KeyboardEvent) {
        this.keys.set(e.code, 'up');

        this.removeCombo(e.code);

        return e.code;

    }

    checkCombo(keyCode: string) {
        const pressedKeys = Array.from(this.keys.entries())
            .filter(([_, state]) => state === 'down' || state === 'pressed')
            .map(([key]) => key)
            ;

        // Для каждой пары нажатых клавиш создаем комбо-событие
        for (const key of pressedKeys) {
            if (key === keyCode) continue;

            // Создаем комбо-события в алфавитном порядке для консистентности
            const keys = [key, keyCode].sort();
            const combo = [keys[0], keys[1]] satisfies KeyCombo;

            // Добавляем в активные комбо-события
            this.combos.add(combo);

            // Проверяем, не было ли это комбо активно ранее
            if (!this.previousCombos.has(combo)) {
                return combo;
            }
        }
    }

    private removeCombo(key: string) {
        for (const combo of this.combos) {
            if (combo.includes(key)) {
                this.combos.delete(combo);
            }
        }
    }

    update() {
        this.previousKeys = new Map(this.keys);
        this.previousCombos = new Set(this.combos);

        this.keys.forEach((state, key) => {
            if (state === 'down' && this.previousKeys.get(key) === 'down') {
                this.keys.set(key, 'pressed');
            }
        });
    }
}