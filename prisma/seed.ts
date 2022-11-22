import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient()
function rand(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function main() {
    let admin;
    let tagsId: string[] = []
    for (let i = 0; i < 2; ++i) {
        const email = faker.internet.email();
        const user = await prisma.user.upsert({
            where: {
                email: email
            },
            update: {},
            create: {
                name: faker.name.fullName(),
                userName: faker.internet.userName(),
                brief: faker.lorem.paragraph(1),
                description: faker.commerce.productDescription(),
                email: email,
                password: faker.internet.password(),
                image: faker.internet.avatar(),
                role: i == 0 ? "USER" : "ADMIN"
            }
        })
        if (i == 1) admin = user;
    }
    for (let i = 0; i < 10; ++i) {
        let name = faker.company.name();
        const tag = await prisma.tag.upsert({
            where: {
                name
            },
            update: {},
            create: {
                name,
                authorId: admin?.id as string
            }
        })
        tagsId.push(tag.id);
    }
    function randTags() {
        interface Create {
            assignedAt: Date;
            tag: {
                connect: {
                    id: string;
                }
            }
        }
        let tags = {
            create: new Array<Create>()
        };
        for (let i = 0; i < rand(0, tagsId.length); i++) {
            let randomTag = tagsId[rand(0, tagsId.length - 1)];
            if (tags.create.find((itm) => {
                return itm.tag.connect.id == randomTag;
            })) continue;
            tags.create.push(
                {
                    assignedAt: new Date(),
                    tag: {
                        connect: {
                            id: randomTag as string,
                        },
                    },
                },
            )
        }
        return tags;
    }
    for (let i = 0; i < 500; ++i) {
        let tags = randTags()
        const post = await prisma.post.create({
            data: {
                title: faker.commerce.productName(),
                breif: faker.lorem.sentences(1),
                image: faker.image.imageUrl(),
                content: faker.lorem.paragraph(rand(20, 50)),
                tags: tags,
                authorId: admin?.id as string,
            }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
