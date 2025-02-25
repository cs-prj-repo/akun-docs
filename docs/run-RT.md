---
title: single-cycle处理器启动RT
editLink: true
layout: doc
---

# {{ $frontmatter.title }}

## 一、参考设计处理器启动RT

1. 克隆`RT`项目

执行下面的命令，克隆`RT`项目
``` shell
$ git clone git@github.com:cs-prj-repo/rt-thread-am.git
```

2. 尝试启动`RT`

执行下面的命令，尝试启动`RT`。
``` 
cd xxx/rt-thread-am/bsp/abstract-machine
make clean
make init
make run ARCH=riscv32-npc
```
::: tip 注意事项

1. 在启动RT的过程中需要`关闭波形`, `关闭指令追踪`, `关闭Difftest`
<br>关闭指令追踪可以注释掉`sim.c`的`IFDEF(CONFIG_ITRACE, instr_trace(cur_pc));`这行代码
<br>关闭Difftest可以注释掉`sim.c`的`IFDEF(CONFIG_DIFFTEST, difftest_step(cur_pc, cur_pc + 4));`这行代码  

2. 每次启动`RT`都要完整的执行以上的命令，即每次启动`RT`都需要重新`make clean`, `make init`一次.
::: 


## 二、完善你的单周期处理器

如果你想要让你的单周期处理器启动`RT`，那么你的处理器需要实现`mret`, `ecall`, `csrrw`, `csrrs`这四条指令，并且支持读写`mstatus`, `mtvec`, `mcause`, `mepc`这四个CSR寄存器。

以下是指令的实现方式:
<br>如果是`ecall`指令， 那么它指令效果需要是`mepc <= pc + 4`并且`mcause <= 32'd1`

以下是CSR寄存器的实现方式:
``` verilog
reg [31:0] mstatus;
reg [31:0] mtvec;
reg [31:0] mepc;
reg [31:0] mcause;

always @(posedge clk) begin
    if(rst) begin
        //CSR寄存器的初始值
		mtvec   <= 32'd0;
		mstatus <= 32'h1800;
		mepc    <= 32'd0;
		mcause  <= 32'd0; 
    end
    else begin
        //other code,
    end
end
```


::: tip 小提示: 读写CSR寄存器时的`csr_id`
<br>读写`mstatus`寄存器的`csr_id=300`
<br>读写`mtvec`寄存器的`csr_id=305`
<br>读写`mepc`寄存器的`csr_id=341`
<br>读写`mcause`寄存器的`csr_id=342`
:::

## 三、使用你自己的处理器启动`RT`

