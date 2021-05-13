# ellipro-reverse-engineered

The [ElliPro web portal](http://tools.iedb.org/ellipro/) is a tool used to predict antibody epitopes on proteins. To use it, you need to give it information on a protein you want to analyse. This information can be either a [PDB file](https://en.wikipedia.org/wiki/Protein_Data_Bank_(file_format)) of the protein or the protein's PDB ID as given in the [Protein Data Bank repository](https://www.rcsb.org/).

Unfortunately, this web portal accepts only proteins whose PDB information is within 5 megabytes large. Most proteins are small enough to fit within this limit, but there are some big-ass mfs like [protein 2MQE](https://www.rcsb.org/3d-view/2MQE). The web portal refuses to accept this protein for analysis. So this repo is a way around this problem.

## Setup

### Set up the PDB files

From this project's root directory, create the folder `media/tmp/ellipro`:

```
mkdir -p ./media/tmp/ellipro
```

Put the PDB files of the proteins you want to analyse in that folder. For example, if we have `2mqe.pdb`, we can put it in the folder so that we have `media/tmp/ellipro/2mqe.pdb`. Do this for all the PDB files you need.

### Set up the ellipro software

Besides being available as a web service, Ellipro is published as a standalone tool as well. This is a command-line program that's released as a java jar file. Download the latest jar from [here](http://tools.iedb.org/ellipro/download/) or older versions from [here](https://downloads.iedb.org/tools/ellipro/).

## Usage


