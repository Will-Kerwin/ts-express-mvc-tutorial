import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import User from "../users/user.entity";

@Entity()
class Address {

    @PrimaryGeneratedColumn()
    public id?: string;

    @Column()
    public street!: string;

    @Column()
    public city!: string;

    @Column()
    public country!: string;

    // second method shows its bidirectional
    @OneToOne(() => User, (user: User) => user.address)
    public user!: User;
}

export default Address;
