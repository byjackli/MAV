
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { firebaseConfig } from '../../../config/index';

const fireApp = initializeApp(firebaseConfig),
    functions = getFunctions(fireApp);

let online = undefined;


interface Options {
    showPrices?: boolean,
}
interface OptionsProd extends Options {
    productId: string
}

export async function getAllProducts(options?: Options): Promise<unknown> {
    if (!online) online = connectFunctionsEmulator(functions, 'localhost', 5001)
    const func = httpsCallable(functions, "getAllProducts"),
        res = await func(JSON.stringify(options)),
        data = res.data;

    return data;
}

export async function getProduct(options?: OptionsProd): Promise<unknown> {
    if (!online) online = connectFunctionsEmulator(functions, 'localhost', 5001)
    const func = httpsCallable(functions, "getProduct"),
        res = await func(JSON.stringify(options)),
        data = res.data;

    return data;
}

export async function getPrice(options?: OptionsProd): Promise<unknown> {
    if (!online) online = connectFunctionsEmulator(functions, 'localhost', 5001)
    const func = httpsCallable(functions, "getPrice"),
        res = await func(JSON.stringify(options)),
        data = res.data;

    return data;
}