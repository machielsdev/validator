import { getValue, isInputElement, isSelectElement } from '../common/dom';

export default {
    async passed(elements: HTMLElement[]): Promise<boolean> {
        const promisedElementFetches = elements.map((element: HTMLElement) => {
            return new Promise((resolve: (value: boolean) => void): void => {
                if (!isInputElement(element) && !isSelectElement(element)) {
                    resolve(true);
                }

                const values = getValue(element);

                if (values.length) {
                    Promise.all(values.map((value: string) => {
                        return fetch(value).then((response: Response) => {
                            return response.status === 200;
                        });
                    })).then((activeResponses: boolean[]) => {
                        resolve( !activeResponses.filter((active: boolean) => !active).length)
                    })
                } else {
                    resolve(true);
                }
            })
        })

        return !(await Promise.all(promisedElementFetches))
            .filter((active: boolean) => !active)
            .length;
    },
    message(): string {
        return 'Not an active url'
    }
}
