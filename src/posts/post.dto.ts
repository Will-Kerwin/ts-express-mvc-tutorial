// A DTO (Data transfer Objcet) carries data between our functions and a spec on how incoming data should look
import {IsString} from "class-validator"

class CreatePostDto {
    @IsString()
    public authors!: string;

    @IsString()
    public content!: string;

    @IsString()
    public title!: string;
}

export default CreatePostDto
