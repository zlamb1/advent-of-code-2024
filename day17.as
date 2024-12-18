0,3,5,4,3,0

main:
adv $3    # $a = $a // 2^3
out $a    # out $a % 8
jnz $main # jmp $a != 0 to $main

2,4,1,7,7,5,0,3,1,7,4,1,5,5, 3,0

main:
bst $a    # $b = $a % 8
bxl $7    # $b = $b ^ 7
cdv $b    # $c = $a // 2^$b
adv $3    # $a = $a // 2^3
bxl $7    # $b = $b ^ 7
bxc $1    # $b = $b ^ $c
out $b    # out $b % 8
jnz $main # jmp $a != 0 to $main

0111