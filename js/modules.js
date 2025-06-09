// hoje provavelmente tem essa lógica ou algo parecido
if(!etiqueta[i]){ //verifica um campo se ele ja esta preenchido
    etiqueta[i]= dataEtiqueta
    return
}else{
    console.log("essa etiqueta ja foi apontada!")
}

// possivel solução 1
if(!etiquetas[i]){

    // Verifica se a etiqueta já existe em qualquer posição do array 
    // verifica novamente o array antes de apontar
    if (etiquetas.includes(dataEtiqueta)) {
        console.log("essa etiqueta já foi apontada em outro lugar!");
        return;
    }else{

        etiquetas[i]= dataEtiqueta
        return
    }

}else{
    console.log("essa etiqueta ja foi apontada!")
}


// possivel solução 2
if (!etiqueta[i]) {
    if (etiquetas.includes(dataEtiqueta)) {
        console.log("essa etiqueta já foi apontada em outro lugar!");
        return;
    }

    etiquetas[i] = dataEtiqueta; //aponta a etiqueta

    // Após adicionar, verifica se há etiquetas repetidas
    const ocorrencias = etiquetas.reduce((acc, valor, index) => {
        if (!acc[valor]) acc[valor] = [];
        acc[valor].push(index);
        return acc;
    }, {});

    // Remove a última ocorrência se tiver duplicadas
    // obs fazer o codigo para devolver o saldo da peça para o estoque
    for (const etiqueta in ocorrencias) {
        if (ocorrencias[etiqueta].length > 1) {
            const indices = ocorrencias[etiqueta];
            const ultimoIndice = indices[indices.length - 1];
            etiquetas[ultimoIndice] = null; // ou '' ou undefined
            console.log(`Etiqueta duplicada removida na posição ${ultimoIndice}`);
        }
    }

    return;
} else {
    console.log("essa etiqueta já foi apontada!");
}

// possivel solução 3 
// rodar 3 vezes a verificação do array no coletor
if(!etiquetas[i]){//primeira verificação

   let etiquetasRef2 = [ArrayDeEtiquetasQueVemDoDB]
    // Verifica se a etiqueta já existe em qualquer posição do array 
    // verifica novamente o array antes de apontar
    if (etiquetasRef2.includes(dataEtiqueta)) {//segunda verificação
        console.log("essa etiqueta já foi apontada em outro lugar!");
        return;
    }else{
        let etiquetasRef3 = [ArrayDeEtiquetasQueVemDoDB]
        if (etiquetasRef3.includes(dataEtiqueta)){//terceira verificão
        console.log("essa etiqueta já foi apontada em outro lugar!");
        return;
        }else{
            etiquetas[i]= dataEtiqueta
            return
        }
    }

}else{
    console.log("essa etiqueta ja foi apontada!")
}