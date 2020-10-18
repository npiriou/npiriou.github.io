// First, checks if it isn't implemented yet. la magie
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

var template =
    `<tr>
    <th>PV</th>
    <td>{0} / {1}</td>
</tr>
<tr>
    <th>PA</th>
    <td>{2} / {3}</td>
</tr>

<tr>
    <th>PM</th>
    <td>{4} / {5}</td>
</tr>

<tr>
    <th>Dommages Bonus</th>
    <td>{6}</td>
</tr>
<tr>
    <th>% Dommages Supplémentaires</th>
    <td>{7}</td>
</tr>`;



var templateSort =
    `<tr>
    <th>PA</th>
    <td>{0}</td>
</tr>
<tr>
    <th>Dommages</th>
    <td>{1} à {2}</td>
</tr>

<tr>
    <th>Portée</th>
    <td>{3} à {4}</td> 
</tr>

<tr>
    <th>Portée Modifiable</th>
    <td>{5}</td>
</tr>
<tr>
    <th>Contrainte de lancer</th>
    <td>{6}</td>
</tr>
<tr>
    <th>Zone</th>
    <td>{7}</td>
</tr>
<tr>
    <th>Ligne de vue</th>
    <td>{8}</td>
</tr>
<tr>
    <th>Cooldown</th>
    <td>{9}</td>
</tr>`;


