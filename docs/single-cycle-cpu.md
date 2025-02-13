---
title: single-cycle-cpu项目使用指南
editLink: true
layout: doc
---

# {{ $frontmatter.title }}

::: tip 注意事项：使用最新的项目代码和文档！
项目会持续修复一些错误或增加一些对用户友好的内容，因此项目和文档会有不间断的更新，我们需要使用最新的项目和文档


关于项目：如果你已经克隆了项目, 可以在项目目录下使用`git pull`来获取最新的项目代码。
<br>关于文档：文档的最新版本会直接呈现在网页上，可以多留意网页上新增了哪些内容

有关`git pull`命令的详细使用，可以通过AI来获得更多的信息。

:::

## 一、项目介绍
该项目是一个RISC-V单周期处理器仿真、测试框架。你可以将你的单周期处理器接入到该框架中，用于验证自己的处理器实现是否正确，也可以在自己的处理器上运行一些简单的软件程序。


支持的指令集:RV32IM

**项目主要目录如下**:
```
single-cycle-cpu
├── abstract-machine                 # 裸机运行时环境(目前忽略它)
├── IP                               # 处理器代码目录
│    ├── mycpu                          # 此目录用于接入你的单周期处理器
│    ├── single-cycle-cpu               # 项目内置的一个单周期处理器(verilog)
│    └── single-cycle-cpu-master        # 项目内置的一个单周期处理器(verilog)
├── software-test                    # 测试处理器的软件程序
│    ├── benchmarks                     # benchmark测试程序
│    │   cpu-tests                      # 简单cpu测试程序
├── simulator                        # 处理器模拟仿真框架
│    ├── include                        
│    │   nemu                           # 用于difftest的nemu动态链接库目录
│    │   src                            # 源代码目录
│    └── Makefile                       
├── Makefile                         
└── README.md

```


##  二、实验环境搭建

### 配置一览
- 操作系统： ubuntu 22.04(LTS), 非root账户
- 仿真工具： Verilator、GTKwave
- 编译工具： RISC-V
- 编程语言： Verilog HDL、C语言

### 安装ubuntu系统

[点击此处查看相关资料](install-ubuntu.md)
<br>
::: tip 记得更换Ubuntu软件源

由于 Ubuntu 默认软件源在国内访问速度较慢，我们建议大家更换为国内的软件源，例如[北外镜像源](https://mirrors.bfsu.edu.cn/help/ubuntu/)。

在更换软件源后，请使用 sudo apt update 命令更新索引。
::: 




### 安装Verilator

Verilator 是一款开源的支持 Verilog 和 SystemVerilog 仿真工具。它能够将给定的电路设计翻译成 C++ 或者 SystemC 的库等中间文件，最后使用 C/C++ 编写激励测试，去调用前面生成的中间文件，由 C/C++ 编译器编译执行，来完成仿真。此外，它也具有静态代码分析的功能。

如果你想要自己编译安装Verilator, 可以参考[官方文档](https://verilator.org/guide/latest/install.html)、CSDN、和知乎。本文主要对文档内容进行整理，并补充一些细节。
你也可以执行下列命令直接安装verilator:
``` shell
sudo apt install verilator
```

### 安装GTKwave
```shell
$ sudo apt install gtkwave
```

### 安装库文件和编译工具
```shell
$ sudo apt-get install build-essential
$ sudo apt-get install libreadline-dev
$ sudo apt-get install llvm-dev
$ sudo apt-get install g++-riscv64-linux-gnu binutils-riscv64-linux-gnu
```

::: tip
目前仍有一部分工具, 暂未提供安装命令，后续会陆续添加支持。
::: 

### 

## 三、初次运行项目

### 1. 获取项目代码
在命令行或终端环境下，执行下列命令获取项目代码

如果之前已经执行过下面代码克隆过该项目，可以在项目目录下使用`git pull`来获取最新代码
<br>或者也可以将已经克隆的项目删除掉之后，再执行下面的命令。
<br>有关`git pull`的一些使用方法，可以通过询问`AI`得知
``` shell
$ git clone git@github.com:cs-prj-repo/single-cycle-cpu.git
```
如果使用上述的git克隆失败，可以使用下面的命令
``` shell
$ git clone https://github.com/cs-prj-repo/single-cycle-cpu.git
```
如果再次克隆失败并且使用的是虚拟机，可以通过下载压缩包并且使用`scp`相关命令，将文件拷贝到虚拟机里面。

### 2. 设置环境变量
在你的`~/.bashrc`文件当中添加如下的环境变量，添加完成后，执行`source ~/.bashrc`命令
<br>有关如何添加环境变量，可以通过询问`AI`得知

``` shell

export CPU_HOME=single-cycle-cpu目录的绝对路径 #复制后记得修改,注意记得是绝对路径
export SIM_HOME=$CPU_HOME/simulator          #直接复制即可
export AM_HOME=$CPU_HOME/abstract-machine    #直接复制即可
export TEST_HOME=$CPU_HOME/software-test     #直接复制即可
```

### 3. 运行项目框架默认的处理器和内置程序
在命令行或终端环境下执行下面命令，尝试使用项目框架默认的处理器运行内置程序。
``` shell
$ cd $SIM_HOME
$ make run
```
如果项目运行后出现一个绿色的`HIT GOOD TRAP`，说明程序运行成功，一切正常。

如果项目运行后出现编译报错，请自行修复，或联系我们并提供报错截图，帮助我们修复错误。

如果项目运行后出现一个红色的`HIG BAD TRAP`, 说明处理器执行指令时出错，一般是处理器实现问题。


::: tip 项目框架的仿真环境对于访存的要求

目前项目框架支持的内存为128MB, 地址空间为[0x80000000, 0x8fffffff], 注意在访存时不要超出该地址空间范围

::: 
::: tip 处理器运行的内置程序
当在`simluator`目录下执行`make run`时，无论项目指定哪个处理器运行，都会运行一个内置的程序
这段内置程序指令存放在`simulator/src/monitor/monitor.c`文件下，其名称为`static const uint32_t img[]`

在运行你的处理器的时候，你可以根据自己的需要来修改此处代码来运行指定的程序指令

注意内置程序指令一定要包含一条`ebreak`指令
:::


::: tip 仿真环境如何判定程序执行结束
项目框架通过指定`ebreak`指令为程序结束的指令来判断一个程序是否运行结束。

在执行程序时，项目框架会在每个程序的最后注入一条`ebraek`指令来达到该效果。

由于内置程序是用户可以自行修改的，所以内置程序的`ebreak`指令需要由用户自己添加。
:::

::: tip 开启/关闭Difftest
项目需要使用DIfftest技术来验证处理器实现是否正确。

项目中Difftest默认处于开启状态

在`simulator/inlcude/utils/open_sim_difftest.h`文件中
可以通过注释或者解开注释`#define CONFIG_DIFFTEST 1`来打开或关闭Difftest功能

注意，开启Difftest会减缓程序运行时间，在进行benchmarck程序对处理器进行跑分时，建议关闭Difftest
:::


::: tip 开启/关闭波形追踪
在处理器运行时，仿真框架可以追踪到处理器运行程序的波形信息。

项目默认波形追踪处于关闭状态

在`simulator/inlcude/utils/open_sim_difftest.h`文件中
可以通过注释或者解开注释`#define CONFIG_NPC_OPEN_SIM 1`来打开或关闭波形追踪功能

谨记，如果开启波形运行大型，则会生成非常大的波形文件，高达1G-50GB，有可能会损害磁盘

因此，当运行一些大型程序时，比如benchmark，一定不要开启波形追踪。

如何使用更小的波形文件格式，如fst，正在开发中。
:::



### 4. 修复riscv32编译错误
第一次运行下面的命令，会出现一个编译错误，我们来修复它。
``` shell
$ cd $TEST_HOME/cpu-tests
$ make run ARCH=riscv32-npc ALL=dummy
```

如果遇到了以下错误:
<br>`/usr/riscv64-linux-gnu/include/bits/wordsize.h:28:3: error: #error "rv32i-based targets are not supported"`
<br>那么使用`sudo`权限修改`/usr/riscv64-linux-gnu/include/bits/wordsize.h`文件
``` vim
 #if __riscv_xlen == 64
 # define __WORDSIZE_TIME64_COMPAT32 1
 #else
    # error "rv32i-based targets are not supported" ----->将这一行注释掉
    # define __WORDSIZE_TIME64_COMPAT32 0           ----->在下面新增这一行
 #endif
```

<br>如果遇到了以下错误：
<br>`/usr/riscv64-linux-gnu/include/gnu/stubs.h:8:11: fatal error: gnu/stubs-ilp32.h: No such file or directory`
<br>那么使用`sudo`权限修改`/usr/riscv64-linux-gnu/include/gnu/stubs.h`文件
<br>将文件的`# include <gnu/stubs-ilp32.h>`这段代码注释掉
<br>


<br>
<br>

## 四、运行测试程序
下面提供了多个可以运行测试程序的命令，选择其中一部分运行即可


::: tip 运行程序对处理器的要求
由于我们的测试程序是可运行的程序，一个可运行程序要求处理器必须能够执行`auipc`, `jal`,`addi`指令
:::
<br>

### 运行riscv官方指令集测试集合
> 在项目提供的测试程序中，官方测试集程序是最完备的测试集程序，检测准确度最高

> 务必以该测试集程序作为处理器测试是否通过的标准
1. 克隆riscv官方指令集测试仓库，可以克隆到任意目录
``` shell
$ git clone git@github.com:cs-prj-repo/riscv-tests-am.git
```

2. 运行riscv官方测试集程序

在命令行或终端下执行下面的代码运行测试集程序
```shell
#运行riscv官方指令集测试程序：
cd xxx/riscv-tests-am
make run ARCH=riscv32-npc ALL=想要测试的指令

#示例1-测试add指令实现是否正确：
cd xxx/riscv-tests-am
make run ARCH=riscv32-npc ALL=add

#示例2-测试sub指令实现是否正确
cd xxx/riscv-tests-am
make run ARCH=riscv32-npc ALL=sub

#示例3-测试所有指令实现是否正确
cd xxx/riscv-tests-am
make run ARCH=riscv32-npc
```

<br>
<br>

### 运行cpu-tests目录下的测试集程序:

> cpu-tests目录下的测试程序只是一些简单的测试程序, 测试准确率并不高

> cpu-tests目录下的测试程序里有一些含有M类指令, 如果你的处理器只支持RV32I，会有一些测试无法通过，这是正常的，请不要担心。

在命令行或终端下执行下面的代码运行测试集程序

``` shell
#运行测试集程序的框架代码：
cd $TEST_HOME/cpu-tests
make run ARCH=riscv32-npc ALL=想运行的程序

#示例2-运行string程序：
cd $TEST_HOME/cpu-tests
make run ARCH=riscv32-npc ALL=dummy

#示例1-运行dummy程序：
cd $TEST_HOME/cpu-tests
make run ARCH=riscv32-npc ALL=dummy

#示例3-运行所有程序：
cd $TEST_HOME/cpu-tests
make run ARCH=riscv32-npc
```

<br>

### 运行benchmarks目录下的测试集程序:
::: tip 运行benchmarks下面测试程序时, 暂时先关闭`Difftest`和`波形追踪`功能
:::

在命令行或终端下执行下面的代码运行测试集程序:
```shell
#运行coremark测试, 至少需要跑两分钟:
cd $TEST_HOME/benchmarks/coremark
make run ARCH=riscv32-npc 


#运行dhrystone测试：
cd $TEST_HOME/benchmarks/dhrystone
make run ARCH=riscv32-npc 

#运行microbench测试1：
cd $TEST_HOME/benchmarks/microbench
make run ARCH=riscv32-npc mainargs=test

#运行microbench测试2：
cd $TEST_HOME/benchmarks/microbench
make run ARCH=riscv32-npc mainargs=train

```

::: tip 小总结
通过执行以上命令，我们可以发现下面的规律:

如果测试程序集里面有多个测试程序
<br>执行`make run ARCH=riscv32-npc ALL=xxx`只会运行一个叫做`xxx`的测试程序
<br>执行`make run ARCH=riscv32-npc` 会运行所有程序

::: 

### 运行CSR指令测试程序
::: tip CSR测试程序注意事项
CSR测试程序虽然已经移植，不过仿真框架暂时不支持其测试---全力开发中
:::
当你实现了`mret`,`ecall`,`csrrw`, `csrrs`指令之后, 可以运行`yield-os`测试程序。
<br>如果处理器实现正确，测试程序会缓慢出现字母`ABABAB`的序列。
<br>如果处理器实现出错，这个程序不是那么的好调试，因为涉及到各种陷入，比较复杂--->待改进

执行下列命令，运行`yield-os`测试程序

``` shell
cd $TEST_HOME/csr-tests/yield-os
make run ARCH=riscv32-npc
```






## 五、指定项目运行你的处理器

首先在`single-cycle-cpu/IP`目录下面新建一个目录，目录的名称不作任何要求。
<br>下文使用`your_cpu_dir`进行代指, 将你的处理器代码全部放到`your_cpu_dir`目录下面
最后再通过simulator/Makefile中的`CPU_DIR`变量为你的处理器目录路径，来指定项目运行你的处理器

::: warning 注意define.v文件必须和你的处理器同在一个目录下面
:::


::: tip 示例

项目通过`simulator/Makefile`中的`CPU_DIR :=$(CPU_HOME)/IP/single-cycle`指定了项目会运行`single-cycle目录下的处理器`

通过修改`CPU_DIR :=$(CPU_HOME)/IP/你的处理器目录名字`, 可以指定项目运行`你的处理器`

<br>示例： 若`simulator/Makefile`中的`CPU_DIR :=$(CPU_HOME)/IP/AAA`, 则项目会运行`AAA`目录下的处理器

:::


## 六、将你的处理器接入仿真环境
为了支持所有的单周期处理器都可以接入该仿真、测试环境, 仿真环境对运行的处理器有一定的要求

### 1. 仿真框架对于处理器最顶层模块名称`TOP_Module_Name`的要求
为了支持所有的单周期处理器都可以接入该仿真、测试环境，我们预先设定了一个最顶层的仿真模块名称，即`TOP_Module_Name=CPU`也就是说处理器最顶层模块名称必须是`CPU`
::: warning 仿真框架只对TOP_Module_Name有此要求，对所有的verilog代码文件名，其他模块名称均没有任何要求。
:::

::: tip 自定义你的处理器TOP_Module_Name

项目通过`simulator/Makefile`中的`TOPNAME :=CPU`指定了处理器最顶层模块名称`TOP_Module_Name`必须为`CPU`

通过修改`TOPNAME :=你写的模块名`, 可以指定处理器最顶层模块名称为`你写的模块名`

<br>示例： 若`simulator/Makefile`中的`TOPNAME :=AAA`, 则处理器最顶层模块名称需要为`AAA`
::: 
<br>

### 2. 仿真框架对处理器最顶层模块的信号要求

无论处理器顶层模块的模块名是什么，它都必须带有下面三个信号`clk`, `rst`, `cur_pc_for_simulator`
如果你对仿真框架比较熟悉，

```verilog
module TOP_Module_Name
(
    input  wire         clk,                    //该信号是仿真框架提供的时钟信号
    input  wire         rst,                    //该信号是仿真框架提供的复位信号
    output wire [31:0]  cur_pc_for_simulator    //该信号需要连接当前的pc值
);

endmodule
```
<br>

### 3. 仿真框架中`clk`和`rst`信号的使用要求

仿真框架`clk`和`rst`信号的使用要求如下：

```verilog
//我们只捕捉时钟上升沿的信号进行处理，示例如下
always @(posedge clk) begin

end

//rst在高电平时进行复位
always @(posedge clk) begin
    if(rst) begin        //高电平时进行复位
        regfile[0] <= 32'h0
    end 
    else begin
        //other code
    end
end

```
<br>

### 4. 仿真框架对于pc复位值的要求
`pc`初始复位值必须为`0x80000000`
``` verilog
always @(posedge clk) begin
    if(rst) begin
        pc <= 32'h80000000; //32位操作系统
    end
end
```
<br>

### 5. 接入仿真框架的DPI-C机制

我们使用Verilator的DPI-C机制将处理器接入到仿真环境，并访问仿真环境的内存。

<br>

#### 对于取指阶段
由于内存是仿真环境提供的，当我们从内存中进行取指时，需要通过DPI-C机制访问内存，使用方法参考下列代码
```verilog
module fetch(
    //其他信号
);

import "DPI-C" function int  dpi_mem_read 	(input int addr  , input int len);
assign instr = dpi_mem_read(pc, 4);
endmodule
```

<br>

#### 对于寄存器文件的访问
由于仿真环境在进行指令验证的时候，需要获取到寄存器文件的内存，所以我们要通过DPI-C机制将寄存器文件信号传递给仿真环境，使用方法参考下列代码
```verilog
module regfile(
    //其他信号
);

reg [31:0] regfile[31:0];
import "DPI-C" function void dpi_read_regfile(input logic [31 : 0] a []);
initial begin
	dpi_read_regfile(regfile);
end
endmodule
```

<br>

#### 对于内存的访问
当处理器需要读写内存的时候，也需要通过DPI-C机制从仿真环境获取到内存数据，使用方法参考下列代码

```verilog
module memory(
    //其他信号
);

import "DPI-C" function void dpi_mem_write(input int addr, input int data, int len);
import "DPI-C" function int  dpi_mem_read (input int addr  , input int len);

//读取内存，每次读取4个字节，然后根据需要，再对读出来的数据进行处理
wire 从内存中读出来的数据(32bit) = dpi_mem_read(要读取的内存地址, 4);

//写入
always @(posedge clk) begin
	if(如果要从内存中读取一个字节) begin
		dpi_mem_write(写入地址, 要写入的数据(32bit), 1);
	end
	else if(如果要从内存中读取两个字节) begin
		dpi_mem_write(要写入的地址, 要写入的数据(32bit), 2);		
	end
	else if(如果要从内存中读取四个字节) begin
		dpi_mem_write(要写入的地址, 要写入的数据(32bit), 4);				
	end
end
```
<br>


## 七、再次运行项目


当将处理器按照文档要求接入到仿真环境以后，我们的准备工作就一切就绪了，下面就要开始在该项目框架下验证我们自己的处理器了。

执行下面命令，再次运行项目
``` shell
$ cd $SIM_HOME
$ make run
```
当项目运行成功后，使用上文中的riscv官方指令测试集即`riscv-tests-am`来验证你的处理器实现是否正确



## 八、[失败调试]如何查看和阅读波形

当处理器运行出现一个红色的`HIT BAD TRAP`字样时，说明处理器执行的指令出错。
当指令出错的时候，我们首先可以根据Difftest打印的错误信息来追踪错误指令，当确定了错误的指令后，可以通过查看波形来排查错误。


### 1. Difftest检测和波形信息说明

我们使用的Difftest是在每一条指令执行完毕后，对比一个`参考处理器`和`你的处理器`的寄存器和`PC`状态信息。

由于大多数指令都会修改寄存器和PC的状态，所以当这样的一条执行完毕后，我们就可以立即比对他们的寄存器和PC状态信息，如果发现处理器实现出错，那么立刻就可以捕捉到这样的错误。

一个例外是Load和Store指令。
<br>Store指令是将寄存器的数据写入到内存中，并不会更改寄存器的状态，所以Difftest无法不会对Store指令进行检测。
<br>Load指令是将内存里面的数据读取到寄存器中，当它发生错误时，有可能不是Load指令自身的问题，而是Store指令出了错。
<br>按照大多数程序执行时的特性，存到内存里面的数据会很快会被指令取出来使用，如果在Load指令将数据从内存里面取到寄存器时出现错误，那么可以推测是Load或Store指令出错。

依据Difftest的机制，当Difftest捕捉到错误的时候，我们结束程序的波形追踪，此时波形文件的最后一条波形就是DIfftest出错的那条指令。
<br>对于非Load和非Store指令来说，波形文件的最后一条波形就是出错的那条指令
<br>对于Load指令来说，有可能不是Load指令出错，而是Store指令出错。如果是Store指令的错误，需要去看最后一条波形的前一些周期，即Store指令的波形。

::: tip Diffetst和波形文件总结
对于非Load和非Store指令来说，波形文件的最后一条波形就是出错的那条指令

对于Load指令来说，有可能不是Load指令出错，而是Store指令出错。如果是Store指令的错误，需要去看波形文件最后一条波形的前一些周期的Store指令的波形。

以上是错误指令在波形文件的大概位置，具体是哪一条波形，我们还需要通过`pc`和`instr`进行精确定位。
:::




### 2. 如何查看波形

每当测试程序成功运行完毕并退出后，仿真测试框架就会将该次处理器运行的波形信息保存下来
此时执行如下命令，查看波形
``` shell
cd $SIM_HOME && make sim
```

### 3. 如何高效查看波形

`gtkwave`在左下角有一个信号搜索框可以进行筛选，可以筛选出自己想要看的信号波形。

