import { Service } from 'typedi';
import Cajero, { IUser } from '../models/Cajero';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

function minutesToSeconds(minutes: number): number {
    return minutes * 60;
}

@Service()
export class CashierService {
    public async registerMasterUser(cajeroData: IUser) {
        const { password, name, email } = cajeroData;
        if (!password || !name || !email) throw new Error('All fields are required');
        const existingSuperUser = await Cajero.findOne({ email });
        if (existingSuperUser) {
            throw new Error('A super user already exists.');
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const cashier = new Cajero({ name: 'admin', email: 'admin', admin: true, superuser: true, password: hashed });
        return await cashier.save();
    }

    public async registerCashier(cajeroData: IUser) {
        const { name, email, password, admin, superuser } = cajeroData;
        if (!name || !email || !password || !admin || !superuser) {
            throw new Error('All fields are required');
        }
        const cashier = new Cajero({ name, email, admin, superuser, password });
        const salt = await bcrypt.genSalt(10);
        cashier.password = await bcrypt.hash(password, salt);
        const cajerosaved = await cashier.save();
        if (cajerosaved) {
            const payload = {
                user: {
                    id: cajerosaved.id,
                    name: cajerosaved.name,
                    admin: cajerosaved.admin,
                    superuser: cajerosaved.superuser,
                },
            };
            const jwtoptions = {
                expiresIn: 108000,
            };
            const secret = process.env.SECRET;//openssl rand -base64 64
            return new Promise((resolve, reject) => {
                jwt.sign(payload, secret, jwtoptions, (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                });
            });
        }
    }

    public async addCashier(cajeroData: IUser) {
        const { name, email, admin, superuser, password } = cajeroData;
        const yaexiste = await Cajero.findOne({ email });
        if (yaexiste) throw new Error('El Cajero ya existe');
        const cajero = new Cajero({ name, email, admin, superuser, password });
        const saltos = await bcrypt.genSalt(10);
        cajero.password = await bcrypt.hash(password, saltos);
        return await cajero.save();
    }

    public async loginCashier(cajeroData: IUser) {
        const { email, password } = cajeroData;
        const cajero = await Cajero.findOne({ email });

        if (!cajero) throw new Error('usuario no se encuentra en la base de datos');
        const match = await bcrypt.compare(password, cajero.password);
        if (match) { 
            const user = {
                id: cajero.id,
                name: cajero.name,
                admin: cajero.admin,
                superuser: cajero.superuser,
            }
            const payload = { user };
            const jwtoptions = {
                expiresIn: minutesToSeconds(120), // 2 hours
            };
            const secret = process.env.SECRET;
            return new Promise((resolve, reject) => {
                jwt.sign(payload, secret, jwtoptions, (err, token) => {
                    if (err) reject(err);
                    resolve({ token, usuarioenviar: user });
                });
            });
        } else {
            throw new Error('Password Invalid');
        }
    }

    public async updateCashier(id: string, cajeroData: IUser) {
        const { name, email, admin, superuser, password } = cajeroData;
        const cajero = await Cajero.findById(id);
        if (!cajero) throw new Error('Cashier not found on DB');
        cajero.name = name;
        cajero.email = email;
        cajero.admin = admin;
        cajero.superuser = superuser;
        const saltos = await bcrypt.genSalt(10);
        cajero.password = await bcrypt.hash(password, saltos);
        return await cajero.save();
    }

    public async seeCashier() {
        return await Cajero.find().select('-password').sort({ date: -1 });
    }

    public async compareEmail(email: string) {
        const query = await Cajero.findOne({ email: email });
        return !!query;
    }

    public async deleteCashier(id: string) {
        const cashier = await Cajero.findById(id);
        if (!cashier) {
            throw new Error('Cashier not Found');
        }
        await cashier.remove();
        return cashier;
    }
} 