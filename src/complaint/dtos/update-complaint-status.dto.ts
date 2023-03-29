import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class updateComplaintStatusDto{

    @IsString()
    @IsNotEmpty()
    @IsIn(['Pending','Resolved'])
    status:string
}